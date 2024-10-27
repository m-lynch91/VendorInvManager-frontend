import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatComponentsModule } from '@app/mat-components/mat-components.module';

import { Vendor } from '@app/vendor/vendor';
import { VendorService } from '@app/vendor/vendor.service';

import { Product } from '@app/product/product';
import { ProductService } from '@app/product/product.service';

import { PurchaseOrder } from '@app/purchase-order/purchase-order';
import { PurchaseOrderService } from '@app/purchase-order/purchase-order.service';
import { PurchaseOrderLineItem } from '@app/purchase-order/purchase-order-line-item';

import { PRODUCT_DEFAULT, VENDOR_DEFAULT, PDF_URL } from '@app/constants';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatComponentsModule],
  templateUrl: './generator.component.html',
  styles: ``,
})
export class GeneratorComponent implements OnInit, OnDestroy {
  // prevent memory leaks
  formSubscription?: Subscription;

  msg: string = '';
  vendorData: Vendor[] = [];
  selectedVendor: Vendor = VENDOR_DEFAULT;
  vendorProductData: Product[] = [];
  selectedProduct: Product = PRODUCT_DEFAULT;
  purchaseOrderLineItems: PurchaseOrderLineItem[] = [];
  selectedQuantity: number = 1;
  generatedReportId: number = 0;

  vendorForm: FormControl;
  productForm: FormControl;
  quantityForm: FormControl;
  generatorFormGroup: FormGroup;

  constructor(
    private builder: FormBuilder,
    private vendorService: VendorService,
    private productService: ProductService,
    private purchaseOrderService: PurchaseOrderService
  ) {
    this.vendorForm = new FormControl('');
    this.productForm = new FormControl('');
    this.quantityForm = new FormControl('');
    this.generatorFormGroup = this.builder.group({
      vendor: this.vendorForm,
      product: this.productForm,
      quantity: this.quantityForm,
    });
  }

  ngOnInit(): void {
    this.msg = 'Loading vendor data from server.';
    this.setupOnVendorPickedEvent();
    this.setupOnProductPickedEvent();
    this.setupOnQuantityPickedEvent();
    this.getVendorData();
  }

  ngOnDestroy(): void {
    if (this.formSubscription !== undefined) {
      this.formSubscription.unsubscribe();
    }
  }

  setupOnVendorPickedEvent(): void {
    this.formSubscription = this.generatorFormGroup
      .get('vendor')
      ?.valueChanges.subscribe((vendor) => {
        if (vendor === null) return;
        this.selectedVendor = vendor;
        this.loadVendorProducts();
        this.purchaseOrderLineItems = [];
        this.selectedProduct = Object.assign({}, PRODUCT_DEFAULT);
        this.selectedQuantity = 1;
        this.productForm.reset();
        this.quantityForm.reset();
        this.msg = `Choose product for vendor`;
        this.generatedReportId = 0;
      });
  }

  setupOnProductPickedEvent(): void {
    const productSubscription = this.generatorFormGroup
      .get('product')
      ?.valueChanges.subscribe((product) => {
        if (product === null) return;

        this.selectedProduct = product;
      });

    this.formSubscription?.add(productSubscription);
  }

  setupOnQuantityPickedEvent(): void {
    const quantitySubscription = this.generatorFormGroup
      .get('quantity')
      ?.valueChanges.subscribe((quantity) => {
        if (quantity === null) return;

        this.selectedQuantity = quantity;

        if (this.isProductAlreadySelected(this.selectedProduct.id)) {
          let purchaseOrderItem = this.getPurchaseOrderItem(
            this.selectedProduct.id
          );

          if (purchaseOrderItem) {
            purchaseOrderItem.quantity = quantity;

            this.calculateTotal();
          }
        } else {
          const item: PurchaseOrderLineItem = {
            id: 0,
            purchaseorderid: 0,
            productid: this.selectedProduct.id,
            quantity: quantity,
            price: this.selectedProduct.purchaseprice,
          };

          this.purchaseOrderLineItems.push(item);
        }

        // remove items with 0 quantity
        this.purchaseOrderLineItems = this.purchaseOrderLineItems.filter(
          (item) => item.quantity > 0
        );
      });

    this.formSubscription?.add(quantitySubscription);
  }

  getVendorData(verbose: boolean = true): void {
    this.vendorService.getAll().subscribe({
      next: (vendors: Vendor[]) => (this.vendorData = vendors),
      error: (e: Error) =>
        (this.msg = `Failed to load vendor data: ${e.message}`),
      complete: () => (verbose ? (this.msg = `Vendor data loaded.`) : null),
    });
  }

  loadVendorProducts(): void {
    this.vendorProductData = [];
    this.productService.getSome(this.selectedVendor.id).subscribe({
      next: (products: Product[]) => (this.vendorProductData = products),
      error: (e: Error) =>
        (this.msg = `Failed to load vendor products: ${e.message}`),
    });
  }

  getPurchaseOrderItem(productid: string): PurchaseOrderLineItem | undefined {
    return this.purchaseOrderLineItems.find((e) => e.productid === productid);
  }

  calculateSubTotal(): number {
    return this.purchaseOrderLineItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }

  calculateTax(): number {
    const TAX_RATE = 0.13;
    return this.calculateSubTotal() * TAX_RATE;
  }

  calculateTotal(): number {
    return this.calculateSubTotal() + this.calculateTax();
  }

  isProductAlreadySelected(productid: string): boolean {
    return (
      this.purchaseOrderLineItems.find(
        (item) => item.productid === productid
      ) !== undefined
    );
  }

  unselectedVendorProducts(): Product[] {
    const products = this.vendorProductData.filter(
      (e) => !this.isProductAlreadySelected(e.id)
    );
    return products;
  }

  createPurchaseOrder(): void {
    const purchaseOrder: PurchaseOrder = {
      id: 0,
      vendorid: this.selectedVendor.id,
      purchaseOrderDate: '',
      amount: this.calculateTotal(),
      lineItems: this.purchaseOrderLineItems,
    };

    this.purchaseOrderService.create(purchaseOrder).subscribe({
      next: (purchaseOrder: PurchaseOrder) => {
        purchaseOrder.id > 0
          ? (this.msg = `Purchase order ${purchaseOrder.id} created.`)
          : (this.msg = `Failed to create purchase order (server error).`);

        this.generatedReportId = purchaseOrder.id;
        console.log(purchaseOrder.id);
        console.log(this.generatedReportId);
      },
      error: (e: Error) =>
        (this.msg = `Failed to create purchase order: ${e.message}`),
      complete: () => this.resetGenerator(),
    });
  }

  resetGenerator(): void {
    this.vendorForm.reset();
    this.productForm.reset();
    this.quantityForm.reset();
    this.selectedVendor = Object.assign({}, VENDOR_DEFAULT);
    this.selectedProduct = Object.assign({}, PRODUCT_DEFAULT);
    this.vendorProductData = [];
    this.purchaseOrderLineItems = [];
    this.selectedQuantity = 1;
  }

  viewPdf(): void {
    window.open(`${PDF_URL}?purchaseorderid=${this.generatedReportId}`);
  }
}

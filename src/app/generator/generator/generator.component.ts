import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatComponentsModule } from '@app/mat-components/mat-components.module';

import { Vendor } from '@app/vendor/vendor';
import { VendorService } from '@app/vendor/vendor.service';

import { Product } from '@app/product/product';
import { ProductService } from '@app/product/product.service';

import { PurchaseOrder } from '@app/purchaseOrder/purchase-order';
import { PurchaseOrderService } from '@app/purchaseOrder/purchase-order.service';
import { PurchaseOrderItem } from '@app/purchaseOrder/purchase-order-item';

import { VENDOR_DEFAULT } from '@app/constants';

@Component({
	selector: 'app-generator',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatComponentsModule],
	templateUrl: './generator.component.html',
	styles: ``
})

export class GeneratorComponent implements OnInit, OnDestroy {
	// prevent memory leaks
	formSubscription?: Subscription;


	msg: string = '';
	vendorData: Vendor[] = [];
	selectedVendor: Vendor = VENDOR_DEFAULT;
	vendorProductData: Product[] = [];
	purchaseOrderItems: PurchaseOrderItem[] = [];
	total: number = 0;
	quantityOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	selectedQuantity: number = 1;
	selectedEOQ: string = '';


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
			quantity: this.quantityForm
		});
	}

	ngOnInit(): void {
		this.msg = 'Loading vendor data from server.';
		this.setupOnVendorPickedEvent();
		this.setupOnProductPickedEvent();
		this.getVendorData();
	}

	ngOnDestroy(): void {
		if (this.formSubscription !== undefined) {
			this.formSubscription.unsubscribe();
		}
	}

	setupOnVendorPickedEvent(): void {
		this.formSubscription = this.generatorFormGroup.get('vendor')?.valueChanges.subscribe(vendor => {
			if (!vendor) return;
			this.selectedVendor = vendor;
			this.loadVendorProducts();
			this.purchaseOrderItems = [];
			this.msg = `Choose product for vendor`;
		});
	}

	setupOnProductPickedEvent(): void {
		const productSubscription = this.generatorFormGroup.get('product')?.valueChanges.subscribe(product => {
			if (!product) return;

			const item: PurchaseOrderItem = {
				id: 0,
				purchaseorderid: 0,
				productid: product.id,
				quantity: 0,
				price: 0
			};

			if (!this.isProductAlreadySelected(product)) {
				this.purchaseOrderItems.push(item);
				this.total += product.amount;
			}
		});

		this.formSubscription?.add(productSubscription);
	}

	getVendorData(verbose: boolean = true): void {
		this.vendorService.getAll().subscribe({
			next: (vendors: Vendor[]) => this.vendorData = vendors,
			error: (e: Error) => this.msg = `Failed to load vendor data: ${e.message}`,
			complete: () => verbose ? this.msg = `Vendor data loaded.` : null,
		})
	}

	loadVendorProducts(): void {
		this.vendorProductData = [];
		this.productService.getSome(this.selectedVendor.id).subscribe({
			next: (products: Product[]) => this.vendorProductData = products,
			error: (e: Error) => this.msg = `Failed to load vendor products: ${e.message}`,
		});
	}

	getProduct(productid: string): Product | undefined {
		return this.vendorProductData.find(e => e.id === productid);
	}

	selectedProducts(): Product[] {
		let products: Product[] = [];
		this.purchaseOrderItems.forEach(item => {
			let product = this.getProduct(item.productid);
			if (product) {
				products.push(product);
			}
		});

		return products;
	}


	isProductAlreadySelected(product: Product): boolean {
		return this.purchaseOrderItems.find(item => item.productid === product.id) !== undefined;
	}

	unselectedVendorProducts(): Product[] {
		const products = this.vendorProductData.filter(e => !this.isProductAlreadySelected(e));
		return products;
	}

	createReport(): void {
		const purchaseOrder: PurchaseOrder = {
			id: 0,
			vendorid: this.selectedVendor.id,
			date: new Date(),
			amount: this.total,
			purchaseOrderItems: this.purchaseOrderItems
		};

		this.purchaseOrderService.create(purchaseOrder).subscribe({
			next: (purchaseOrder: PurchaseOrder) => {
				purchaseOrder.id > 0
					? this.msg = `Purchase order ${purchaseOrder.id} created.`
					: this.msg = `Failed to create purchase order (server error).`;

				console.log(purchaseOrder);
				console.log(this.msg);
			},
			error: (e: Error) => this.msg = `Failed to create purchase order: ${e.message}`,
			complete: () => this.resetGenerator(),
		});
	}

	resetGenerator(): void {
		this.vendorForm.reset();
		this.productForm.reset();
		this.quantityForm.reset();
		this.selectedVendor = Object.assign({}, VENDOR_DEFAULT);
		this.vendorProductData = [];
		this.purchaseOrderItems = [];
		this.total = 0;
		this.selectedQuantity = 1;
	}


}

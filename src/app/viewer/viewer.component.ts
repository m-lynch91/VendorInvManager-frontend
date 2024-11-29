import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatOptionSelectionChange } from '@angular/material/core';

import { MatComponentsModule } from '@app/mat-components/mat-components.module';

import { Vendor } from '@app/vendor/vendor';
import { VendorService } from '@app/vendor/vendor.service';

import { Product } from '@app/product/product';
import { ProductService } from '@app/product/product.service';

import { PurchaseOrder } from '@app/purchase-order/purchase-order';
import { PurchaseOrderService } from '@app/purchase-order/purchase-order.service';
import { PurchaseOrderLineItem } from '@app/purchase-order/purchase-order-line-item';

import { PRODUCT_DEFAULT, VENDOR_DEFAULT, PDF_URL, PURCHASE_ORDER_DEFAULT } from '@app/constants';
import { C } from '@angular/cdk/keycodes';

interface DisplayItem {
	productName: string;
	purchaseOrderAmount: number;
	lineItemQuantity: number;
	extended: number;
}

@Component({
	selector: 'app-viewer',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatComponentsModule],
	templateUrl: './viewer.component.html',
	styles: ``
})
export class ViewerComponent implements OnInit, OnDestroy {
	// prevent memory leaks
	formSubscription?: Subscription;

	msg: string = '';
	vendorData: Vendor[] = [];
	selectedVendor: Vendor = VENDOR_DEFAULT;
	vendorProductData: Product[] = [];
	vendorPurchaseOrders: PurchaseOrder[] = [];
	purchaseOrderLineItems: PurchaseOrderLineItem[] = [];
	selectedPurchaseOrder: PurchaseOrder = PURCHASE_ORDER_DEFAULT;
	displayItems: DisplayItem[] = [];

	constructor(
		private builder: FormBuilder,
		private vendorService: VendorService,
		private productService: ProductService,
		private purchaseOrderService: PurchaseOrderService
	) { }

	ngOnInit(): void {
		this.msg = 'Loading employee data from server.';
		this.getVendorData();

	}

	ngOnDestroy(): void {
		if (this.formSubscription !== undefined) {
			this.formSubscription.unsubscribe();
		}
	}

	getVendorData(verbose: boolean = true): void {
		this.vendorService.getAll().subscribe({
			next: (vendors: Vendor[]) => (this.vendorData = vendors),
			error: (e: Error) =>
				(this.msg = `Failed to load vendor purchase order data: ${e.message}`),
			complete: () => (verbose ? (this.msg = `Vendor purchase order data loaded.`) : null),
		});
	}

	onVendorSelected(event: MatOptionSelectionChange) {
		// filter out unselected event
		if (!event.isUserInput) return;
		console.log(event)

		this.selectedVendor = event.source.value;

		this.selectedPurchaseOrder = Object.assign({}, PURCHASE_ORDER_DEFAULT);

		this.productService.getSome(this.selectedVendor.id).subscribe({
			next: (products: Product[]) => {
				this.vendorProductData = products
				// console.log(this.vendorProductData)
			},
			error: (e: Error) =>
				(this.msg = `Failed to load products from vendor: ${e.message}`),
		})

		this.purchaseOrderService.getSome(this.selectedVendor.id).subscribe({
			next: (purchaseOrders: PurchaseOrder[]) => {
				(this.vendorPurchaseOrders = purchaseOrders)
				// console.log(this.vendorPurchaseOrders)
			},
			error: (e: Error) =>
				(this.msg = `Failed to load PO data from vendor: ${e.message}`),
			complete: () => this.msg = `Vendor PO data loaded.`,
		});
	}

	onPurchaseOrderSelected(event: MatOptionSelectionChange) {
		// filter out unselected event
		if (!event.isUserInput) return;

		this.selectedPurchaseOrder = event.source.value;
		this.msg = `Purchase Order ID ${this.selectedPurchaseOrder.id} selected.`
	}


	getDisplayItems(): DisplayItem[] {
		if (!this.selectedPurchaseOrder || !this.vendorProductData.length) return [];
		this.displayItems = [];

		// Map product IDs to product names for efficient lookup
		const productMap = new Map(
			this.vendorProductData.map((product) => [product.id, product.name])
		);

		// Find line items for the selected purchase order
		this.selectedPurchaseOrder.lineItems.forEach((lineItem) => {
			const productName = productMap.get(lineItem.productid) || 'Unknown Product';
			this.displayItems.push({
				productName,
				lineItemQuantity: lineItem.quantity,
				purchaseOrderAmount: lineItem.price,
				extended: (lineItem.quantity * lineItem.price)
			});
		});

		return this.displayItems;
	}

	calculateSubTotal(): number {
		return this.displayItems.reduce(
			(acc, item) => acc + item.purchaseOrderAmount * item.lineItemQuantity,
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

	viewPdf(): void {
		window.open(`${PDF_URL}?reportid=${this.selectedPurchaseOrder.id}`);
	}
}

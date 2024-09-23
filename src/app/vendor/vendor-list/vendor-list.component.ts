import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Vendor } from '../vendor';

@Component({
	selector: 'app-vendor-list',
	template: `
	<mat-list-item *ngFor="let vendor of vendors" (click)="onVendorSelected.emit(vendor)">
		{{ vendor.id }} - {{ vendor.name }}
	</mat-list-item>
	`,
	styles: ``
})

export class VendorListComponent {
	@Input() vendors?: Vendor[];
	@Output() onVendorSelected = new EventEmitter();

}

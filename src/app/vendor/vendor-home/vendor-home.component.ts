import { Component, OnInit } from '@angular/core';

import { Vendor } from '@app/vendor/vendor';
import { VendorService } from '@app/vendor/vendor.service';
import { VENDOR_DEFAULT } from '@app/constants';

import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-vendor-home',
	templateUrl: './vendor-home.component.html',
	styles: ``
})

export class VendorHomeComponent implements OnInit {
	msg: string = '';

	vendorData$?: Observable<Vendor[]>;
	vendorInDetail: Vendor;
	loadForm: boolean;

	constructor(public vendorService: VendorService) {
		this.msg = '';
		this.vendorInDetail = VENDOR_DEFAULT;
		this.loadForm = false;
	}

	ngOnInit(): void {
		this.msg = "Loading...";
		this.getAll();
	}

	onSelect(vendor: Vendor): void {
		this.vendorInDetail = vendor;
		this.msg = `${vendor.name} selected`;
		this.loadForm = true;
	}

	// event handler for cancel button
	onCancel(): void {
		this.msg = 'Operation cancelled';
		this.loadForm = false;
	}

	// send vendor to service for deletion
	onDelete(vendor: Vendor): void {
		this.vendorService.delete(vendor.id.toString()).subscribe({
			next: (numberOfVendorsDeleted: number) => numberOfVendorsDeleted === 1
				? (this.msg = `Vendor ${vendor.name} deleted.`)
				: (this.msg = `Vendor not deleted.`),
			error: (err: Error) => this.msg = `Delete failed: ${err.message}`,
			complete: () => this.loadForm = false,
		});
	}

	// save - determine whether we're doing an add or an update
	onSave(vendor: Vendor): void {
		vendor.id ? this.update(vendor) : this.create(vendor);
	}


	// add - send vendor to service, receive new vendor back
	create(vendor: Vendor): void {
		this.vendorService.create(vendor).subscribe({
			next: (newVendor: Vendor) => {
				this.msg = `Vendor ${newVendor.id} added.`;
			},
			error: (err: Error) => { this.msg = `Vendor not added: ${err.message}` },
			complete: () => this.loadForm = false,
		});
	}

	// send changed update to service
	update(vendor: Vendor): void {
		this.vendorService.update(vendor).subscribe({

			// create observable
			next: (updatedVendor: Vendor) => (this.msg = `Vendor ${updatedVendor.id} updated.`),
			error: (err: Error) => (this.msg = `Update failed. - ${err.message}`),
			complete: () => (this.loadForm = false),
		})
	}

	// delete(vendor: Vendor): void {
	// 	this.vendorService.delete(vendor.id.toString()).subscribe({
	// 		next: (numberOfVendorsDeleted: number) => numberOfVendorsDeleted === 1
	// 			? (this.msg = `Vendor: ${vendor.name} deleted.`)
	// 			: (this.msg = `Vendor not deleted.`),
	// 		error: (err: Error) => this.msg = `Delete failed: ${err.message}`,
	// 		complete: () => this.inDetail = false,
	// 	});
	// }

	newVendorInDetail(): void {
		this.vendorInDetail = VENDOR_DEFAULT;
		this.loadForm = true;
		this.msg = `New Vendor`;
	}

	getAll(): void {
		this.vendorData$ = this.vendorService.getAll();
		this.vendorData$.subscribe({
			error: (e: Error) => this.msg = `Couldn't get vendors: ${e.message}`,
			complete: () => this.msg = `Vendors loaded!`,
		})
	}
}

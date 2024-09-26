import { Component, OnInit } from '@angular/core';

import { Vendor } from '../vendor';
import { VendorService } from '../vendor.service';
import { VENDOR_DEFAULT } from '../../constants';

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
	inDetail: boolean;
	loaded: boolean;

	constructor(public vendorService: VendorService) {
		this.msg = '';
		this.vendorInDetail = VENDOR_DEFAULT;
		this.inDetail = false;
		this.loaded = false;
	}

	ngOnInit(): void {
		this.msg = "Loading...";
		this.vendorData$ = this.vendorService.get();
	}

	onSelect(vendor: Vendor): void {
		this.vendorInDetail = vendor;
		this.msg = `${vendor.name} selected`;
		this.inDetail = true;
	}

	// event handler for cancel button
	onCancel(): void {
		this.msg = 'Operation cancelled';
		this.inDetail = false;
	}

	// send vendor to service for deletion
	onDelete(vendor: Vendor): void {
		this.vendorService.delete(vendor.id).subscribe({
			next: (numberOfVendorsDeleted: number) => numberOfVendorsDeleted === 1
				? (this.msg = `Vendor ${vendor.name} deleted.`)
				: (this.msg = `Vendor not deleted.`),
			error: (err: Error) => this.msg = `Delete failed: ${err.message}`,
			complete: () => this.inDetail = false,
		});
	}

	// save - determine whether we're doing an add or an update
	onSave(vendor: Vendor): void {
		vendor.id ? this.update(vendor) : this.add(vendor);
	}


	// add - send vendor to service, receive new vendor back
	add(vendor: Vendor): void {
		this.vendorService.add(vendor).subscribe({
			next: (newVendor: Vendor) => {
				this.msg = `Vendor ${newVendor.id} added.`;
			},
			error: (err: Error) => { this.msg = `Vendor not added: ${err.message}` },
			complete: () => this.inDetail = false,
		});
	}

	// send changed update to service
	update(vendor: Vendor): void {
		this.vendorService.update(vendor).subscribe({

			// create observable
			next: (updatedVendor: Vendor) => (this.msg = `Vendor ${updatedVendor.id} updated.`),
			error: (err: Error) => (this.msg = `Update failed. - ${err.message}`),
			complete: () => (this.inDetail = false),
		})
	}

	delete(vendor: Vendor): void {
		this.vendorService.delete(vendor.id).subscribe({
			next: (numberOfVendorsDeleted: number) => numberOfVendorsDeleted === 1
				? (this.msg = `Vendor: ${vendor.name} deleted.`)
				: (this.msg = `Vendor not deleted.`),
			error: (err: Error) => this.msg = `Delete failed: ${err.message}`,
			complete: () => this.inDetail = false,
		});
	}

	newVendorInDetail(): void {
		this.vendorInDetail = VENDOR_DEFAULT;
		this.msg = `New Vendor`;
	}
}

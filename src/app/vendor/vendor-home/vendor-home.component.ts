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

export class VendorHomeComponent implements OnInit{
	msg: string = '';
	
	vendorData$?: Observable<Vendor[]>;
	vendorInDetail: Vendor;
	editing: boolean;
	loaded: boolean;

	constructor(public vendorService: VendorService) {
		this.msg = '';
		this.vendorInDetail = VENDOR_DEFAULT;
		this.editing = false;
		this.loaded = false;
	}

	ngOnInit(): void {
		this.msg = "Loading...";

		this.vendorData$ = this.vendorService.get().pipe(
			tap(() => {
				if (!this.loaded) {
					this.msg = 'Vendors loaded via async pipe';
					this.loaded = true;
				}
			})
		)
	}

	select(vendor: Vendor): void {
		this.vendorInDetail = vendor;
		this.msg = `${vendor.name} selected`;
		this.editing = !this.editing;
	}

	// event handler for cancel button
	cancel(): void {
		this.msg = 'Operation cancelled';
		this.editing = !this.editing;
	}

	// send changed update to service
	update(vendor: Vendor): void {
		this.vendorService.update(vendor).subscribe({
			
			// create observable
			next: (vend: Vendor) => (this.msg = `Vendor ${vend.id} updated!`),
			error: (err: Error) => (this.msg = `Update failed. - ${err.message}`),
			complete: () => (this.editing = !this.editing),
		})
	}
}

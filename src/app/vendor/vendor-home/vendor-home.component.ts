import { Component, OnInit } from '@angular/core';

import { Vendor } from '../vendor';
import { VendorService } from '../vendor.service';

@Component({
	selector: 'app-vendor-home',
	templateUrl: './vendor-home.component.html',
	styles: ``
})

export class VendorHomeComponent implements OnInit{
	vendorData: Array<Vendor> = [];
	msg: string = '';

	constructor(public vendorService: VendorService) {

	}

	ngOnInit(): void {
		this.msg = "Loading...";

		this.vendorService.get().subscribe({
			next: (payload: any) => {
				this.vendorData = payload['_embedded']['vendors'];
				this.msg = 'Vendors loaded.';
			},
			error: (err: Error) => (this.msg = `HTTP GET FAILURE - ${err.message}`),
			complete: () => {},

		})
	}
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Vendor } from './vendor'
import { GenericHttpService } from '../generic-http.service';

@Injectable({
	providedIn: 'root'
})

export class VendorService extends GenericHttpService<Vendor> {
	constructor(http: HttpClient) {
		super(http, "vendors");
	}
}

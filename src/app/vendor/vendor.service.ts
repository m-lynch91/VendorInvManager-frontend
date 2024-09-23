import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BASE_URL, API_GET, API_UPDATE } from '../constants';
import { Vendor } from './vendor'

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators'

@Injectable({
	providedIn: 'root'
})

export class VendorService {
	constructor(public http: HttpClient) {
	}

	get(): Observable<Vendor[]> {
		return this.http.get<Vendor[]>(API_GET).pipe(retry(1), catchError(this.handleError));
	}

	update(vendor: Vendor) {
		return this.http.put<Vendor>(API_UPDATE, vendor).pipe(retry(1), catchError(this.handleError));
	}

	// error handling
	handleError(error: any) {
		let errorMessage = '';

		error.error instanceof ErrorEvent
			? // get client-side error
			(errorMessage = error.error.message)
			: // get server-side error
			(errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`);

		console.log(errorMessage);

		return throwError(() => errorMessage);
	}
}

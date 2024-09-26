import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BASE_URL, API_GET, API_UPDATE, API_ADD, API_DELETE } from '../constants';
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

	add(vendor: Vendor): Observable<Vendor> {
		return this.http.post<Vendor>(API_ADD + vendor.id, vendor).pipe(retry(1), catchError(this.handleError));
	}

	delete(id: number): Observable<number> {
		return this.http.delete<number>(API_DELETE + id).pipe(retry(1), catchError(this.handleError));
	}

	// error handling
	handleError(error: any) {
		let errorMessage = error.message;

		console.log(error);
		console.log(errorMessage);

		return throwError(() => errorMessage);
	}
}

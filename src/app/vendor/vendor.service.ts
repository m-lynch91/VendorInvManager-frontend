import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BASE_URL } from '../constants';

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators'

@Injectable({
	providedIn: 'root'
})

export class VendorService {
	resourceURL: string;

	constructor(public http: HttpClient) {
		this.resourceURL = `${BASE_URL}/vendors`;
	}

	get(): Observable<any> {
		return this.http.get(this.resourceURL).pipe(retry(1), catchError(this.handleError));
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

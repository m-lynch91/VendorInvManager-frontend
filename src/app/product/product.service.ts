import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// project imports
import { Product } from '@app/product/product';
import { GenericHttpService } from '@app/generic-http.service';

@Injectable({
	providedIn: 'root'
})

export class ProductService extends GenericHttpService<Product> {
	constructor(http: HttpClient) {
		super(http, "products");
	}
}

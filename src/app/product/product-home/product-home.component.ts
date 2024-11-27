import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

// project imports
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { Product } from '@app/product/product';
import { ProductService } from '@app/product/product.service';
import { Vendor } from '@app/vendor/vendor';
import { VendorModule } from '@app/vendor/vendor.module';
import { VendorService } from '@app/vendor/vendor.service';
import { PRODUCT_DEFAULT } from '@app/constants';
import { ProductDetailComponent } from '@app/product/product-detail/product-detail.component';

@Component({
	selector: 'app-product-home',
	standalone: true,
	imports: [CommonModule, MatComponentsModule, VendorModule, ProductDetailComponent],
	templateUrl: './product-home.component.html',
})

export class ProductHomeComponent implements OnInit {
	msg: string = '';
	showDetails: boolean = false;
	displayedColumns: string[] = ['id', 'name', 'vendorid'];
	dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();
	vendorData: Vendor[] = [];
	productInDetail: Product = PRODUCT_DEFAULT;

	pageSize = 5; 
	@ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) { 
	this.dataSource.paginator = paginator; 
	} 

	constructor(public productService: ProductService, public vendorService: VendorService) { }

	ngOnInit(): void {
		this.getAllVendors();
		this.getAllProducts();
	}

	getAllVendors(verbose: boolean = true): void {
		this.vendorService.getAll().subscribe({
			next: (vendors: Vendor[]) => {
				this.vendorData = vendors;
			},
			error: (e: Error) => this.msg = `Failed to load vendors - ${e.message}`,
			complete: () => verbose ? this.msg = `Vendors loaded.` : null,
		})
	}

	getAllProducts(verbose: boolean = true): void {
		this.productService.getAll().subscribe({
			next: (products: Product[]) => {
				this.dataSource.data = products;
			},
			error: (e: Error) => this.msg = `Failed to load products - ${e.message}`,
			complete: () => verbose ? this.msg = `Products loaded.` : null,
		});
	}

	onSelect(selectedProduct: Product): void {
		this.productInDetail = selectedProduct;
		this.msg = `Product ${selectedProduct.id} selected.`;
		this.showDetails = true;
	}

	onSave(product: Product): void {
		this.productExists(product) ? this.onUpdate(product) : this.onCreate(product);
	}

	onUpdate(product: Product): void {
		this.msg = 'Updating product...';
		this.productService.update(product).subscribe({
			next: (e: Product) => {
				this.msg = `Product ${e.id} updated!`;
				this.getAllProducts(false);		// refresh table - not verbose
			},
			error: (e: Error) => this.msg = `Update failed: ${e.message}`,
			complete: () => this.showDetails = false,
		});
	}

	onCreate(product: Product): void {
		this.msg = `Creating product...`;
		this.productService.create(product).subscribe({
			next: (p: Product) => {
				this.msg = p.id !== '' ? `Product ${p.id} added.` : `Product ${p.id} not added.`;
				this.getAllProducts(false);		// refresh table - not verbose
			},
			error: (e: Error) => this.msg = `Create failed: ${e.message}`,
			complete: () => this.showDetails = false,
		})
	}

	onDelete(product: Product): void {
		this.productService.delete(product.id).subscribe({
			next: (rowsUpdated: number) => {
				this.msg = rowsUpdated === 1 ? `Product ${product.id} deleted.` : `Product ${product.id} not deleted.`;
				this.getAllProducts(false); 	// refresh table - not verbose
			},
			error: (e: Error) => this.msg = `Delete failed: ${e.message}`,
			complete: () => this.showDetails = false,
		})
	}

	onCancel(): void {
		this.msg = `Operation cancelled.`;
		this.showDetails = false;
	}

	startNewProduct(): void {
		this.productInDetail = Object.assign({}, PRODUCT_DEFAULT);
		this.msg = `New Product`;
		this.showDetails = true;
	}

	sortProducts(sort: Sort): void {
		const literals = {
			id: () =>
				this.dataSource.data = this.dataSource.data.sort(
					(a: Product, b: Product) => sort.direction === 'asc'
						? (a.name < b.name ? -1 : 1)
						: (b.name < a.name ? -1 : 1)
				),
			vendorid: () =>
				this.dataSource.data = this.dataSource.data.sort(
					(a: Product, b: Product) => sort.direction === 'asc'
						? (a.vendorid - b.vendorid)
						: (b.vendorid - a.vendorid)
				),
			name: () =>
				this.dataSource.data = this.dataSource.data.sort(
					(a: Product, b: Product) => sort.direction === 'asc'
						? (a.name < b.name ? -1 : 1)
						: (b.name < a.name ? -1 : 1)
				),
		};
		literals[sort.active as keyof typeof literals]();
	}

	productExists(product: Product): boolean {
		let products: Product[] = this.dataSource.data;
		if (products?.length > 0) {
			if (products.find(p => p.id === product.id) !== undefined) {
				return true;
			}
		}
		return false;
	}

}

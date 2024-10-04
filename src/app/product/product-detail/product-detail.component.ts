import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


// project imports
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { Product } from '@app/product/product';
import { Vendor } from '@app/vendor/vendor';
import { PRODUCT_DEFAULT } from '@app/constants';
import { ValiateDecimal } from '@app/validators/decimal.validator';
import { ValiateInt } from '@app/validators/int.validator';


@Component({
	selector: 'app-product-detail',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatComponentsModule],
	templateUrl: './product-detail.component.html',
	styles: [],
})

export class ProductDetailComponent implements OnInit {
	@Input() selectedProduct: Product = PRODUCT_DEFAULT;
	@Input() products: Product[] | null = null;
	@Input() vendors: Vendor[] | null = null;

	@Output() cancelled = new EventEmitter;
	@Output() saved = new EventEmitter;
	@Output() deleted = new EventEmitter;

	id: FormControl;
	vendorid: FormControl;
	name: FormControl;
	purchaseprice: FormControl;
	msrp: FormControl;
	reorderpoint: FormControl;
	economicorderquantity: FormControl;
	quantityonhand: FormControl;
	quantityonorder: FormControl;
	qrcode: FormControl;
	qrcodetext: FormControl;

	productForm: FormGroup;

	constructor(private builder: FormBuilder) {
		this.id = new FormControl('', Validators.compose([Validators.required, this.uniqueCodeValidator.bind(this)]));
		this.vendorid = new FormControl('', Validators.compose([Validators.required, Validators.min(1)]));
		this.name = new FormControl('', Validators.compose([Validators.required]));
		this.purchaseprice = new FormControl('', Validators.compose([Validators.required, ValiateDecimal]));
		this.msrp = new FormControl('', Validators.compose([Validators.required, ValiateDecimal]));
		this.reorderpoint = new FormControl('', Validators.compose([Validators.required, ValiateInt]));
		this.economicorderquantity = new FormControl('', Validators.compose([Validators.required, ValiateInt]));
		this.quantityonhand = new FormControl('', Validators.compose([Validators.required, ValiateInt]));
		this.quantityonorder = new FormControl('', Validators.compose([Validators.required, ValiateInt]));
		this.qrcode = new FormControl('', Validators.compose([Validators.required]));
		this.qrcodetext = new FormControl('', Validators.compose([Validators.required]));

		this.productForm = this.builder.group({
			id: this.id,
			vendorid: this.vendorid,
			name: this.name,
			purchaseprice: this.purchaseprice,
			msrp: this.msrp,
			reorderpoint: this.reorderpoint,
			economicorderquantity: this.economicorderquantity,
			quantityonhand: this.quantityonhand,
			quantityonorder: this.quantityonorder,
			qrcode: this.qrcode,
			qrcodetext: this.qrcodetext,
		});
	}

	ngOnInit(): void {
		this.productForm.patchValue({
			id: this.selectedProduct.id,
			vendorid: this.selectedProduct.vendorid,
			name: this.selectedProduct.name,
			purchaseprice: this.selectedProduct.purchaseprice,
			msrp: this.selectedProduct.msrp,
			reorderpoint: this.selectedProduct.reorderpoint,
			economicorderquantity: this.selectedProduct.economicorderquantity,
			quantityonhand: this.selectedProduct.quantityonhand,
			quantityonorder: this.selectedProduct.quantityonorder,
			qrcode: this.selectedProduct.qrcode,
			qrcodetext: this.selectedProduct.qrcodetext,
		});
	}

	updateProduct(): void {
		this.selectedProduct.id = this.productForm.value.id;
		this.selectedProduct.vendorid = this.productForm.value.vendorid;
		this.selectedProduct.name = this.productForm.value.name;
		this.selectedProduct.purchaseprice = this.productForm.value.purchaseprice;
		this.selectedProduct.msrp = this.productForm.value.msrp;
		this.selectedProduct.reorderpoint = this.productForm.value.reorderpoint;
		this.selectedProduct.economicorderquantity = this.productForm.value.economicorderquantity;
		this.selectedProduct.quantityonhand = this.productForm.value.quantityonhand;
		this.selectedProduct.quantityonorder = this.productForm.value.quantityonorder;
		this.selectedProduct.qrcode = this.productForm.value.qrcode;
		this.selectedProduct.qrcodetext = this.productForm.value.qrcodetext;
		this.saved.emit(this.selectedProduct);
	}

	deleteProduct(product: Product) {
		this.deleted.emit(product);
	}

	/** 
	* uniqueCodeValidator - needed access to products property so not 
	* with the rest of the validators 
	*/
	uniqueCodeValidator(control: AbstractControl): { idExists: boolean } | null {
		if (this.products && this.products?.length > 0) {
			if (
				this.products.find(
					(p) => p.id === control.value && !this.selectedProduct.id
				) !== undefined
			) {
				return { idExists: true };
			}
		}
		return null; // if we make it here there are no product codes 
	} // uniqueCodeValidator 

}

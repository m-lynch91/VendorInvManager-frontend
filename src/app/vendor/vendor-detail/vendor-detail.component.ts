import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
 FormControl,
 FormGroup,
 FormBuilder,
 Validators
} from '@angular/forms';

import { Vendor } from '@app/vendor/vendor';
import { VENDOR_DEFAULT } from '@app/constants';
import { ValidatePhone,  } from '@app/validators/phonenumber.validator';
import { ValidatePostalCode } from '@app/validators/postalcode.validator';

@Component({
    selector: 'app-vendor-detail',
    templateUrl: './vendor-detail.component.html',
})
export class VendorDetailComponent implements OnInit {
    @Input() selectedVendor: Vendor = VENDOR_DEFAULT;

    @Output() cancelled = new EventEmitter;
    @Output() saved = new EventEmitter;
    @Output() deleted = new EventEmitter;

    name: FormControl;
    address: FormControl;
    city: FormControl;
    province: FormControl;
    postalCode: FormControl;
    phone: FormControl;
    type: FormControl;
    email: FormControl;

    vendorForm: FormGroup;

    constructor(private builder: FormBuilder) {
        this.name = new FormControl('', Validators.compose([Validators.required]));
        this.address = new FormControl('', Validators.compose([Validators.required]));
        this.city = new FormControl('', Validators.compose([Validators.required]));
        this.province = new FormControl('', Validators.compose([Validators.required]));
        this.postalCode = new FormControl('', Validators.compose([Validators.required, ValidatePostalCode]));
        this.phone = new FormControl('', Validators.compose([Validators.required, ValidatePhone]));
        this.type = new FormControl('', Validators.compose([Validators.required]));
        this.email = new FormControl('', Validators.compose([Validators.required, Validators.email])); 

        this.vendorForm = new FormGroup({
            name: this.name,
            address: this.address,
            city: this.city,
            province: this.province,
            postalCode: this.postalCode,
            phone: this.phone,
            type: this.type,
            email: this.email,
        });
    }

    ngOnInit(): void {
        this.vendorForm.patchValue({
            name: this.selectedVendor.name,
            address: this.selectedVendor.address,
            city: this.selectedVendor.city,
            province: this.selectedVendor.province,
            postalCode: this.selectedVendor.postalCode,
            phone: this.selectedVendor.phone,
            type: this.selectedVendor.type,
            email: this.selectedVendor.email,
        });
    }

    updateVendor(): void { 
        this.selectedVendor.name = this.vendorForm.value.name;
        this.selectedVendor.address = this.vendorForm.value.address;
        this.selectedVendor.city = this.vendorForm.value.city;
        this.selectedVendor.province = this.vendorForm.value.province;
        this.selectedVendor.postalCode = this.vendorForm.value.postalCode;
        this.selectedVendor.phone = this.vendorForm.value.phone;
        this.selectedVendor.postalCode = this.vendorForm.value.postalCode;
        this.selectedVendor.email = this.vendorForm.value.email;
        this.saved.emit(this.selectedVendor);
    }

    deleteVendor(vendor: Vendor) {
        this.deleted.emit(vendor);
    }

}

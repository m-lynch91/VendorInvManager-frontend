import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
 FormControl,
 FormGroup,
 FormBuilder,
} from '@angular/forms';

import { Vendor } from '../vendor';
import { VENDOR_DEFAULT } from '../../constants';
import { last } from 'rxjs';

@Component({
    selector: 'app-vendor-detail',
    templateUrl: './vendor-detail.component.html',
})
export class VendorDetailComponent implements OnInit {
    @Input() selectedVendor: Vendor = VENDOR_DEFAULT;

    @Output() cancelled = new EventEmitter;
    @Output() saved = new EventEmitter;

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
        this.name = new FormControl('');
        this.address = new FormControl('');
        this.city = new FormControl('');
        this.province = new FormControl('');
        this.postalCode = new FormControl('');
        this.phone = new FormControl('');
        this.type = new FormControl('');
        this.email = new FormControl(''); 

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

}

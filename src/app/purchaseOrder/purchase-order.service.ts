import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// project imports
import { PurchaseOrder } from '@app/purchaseOrder/purchase-order';
import { GenericHttpService } from '@app/generic-http.service';

@Injectable({
  providedIn: 'root'
})

export class PurchaseOrderService extends GenericHttpService<PurchaseOrder> {
  constructor(http: HttpClient) {
    super(http, 'purchase-orders');
  }
}

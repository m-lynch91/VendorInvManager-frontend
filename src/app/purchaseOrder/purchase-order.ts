import { PurchaseOrderItem } from "./purchase-order-item";

export interface PurchaseOrder {
    id: number;
    vendorid: number;
    date: Date;
    amount: number;
    purchaseOrderItems: PurchaseOrderItem[];
}

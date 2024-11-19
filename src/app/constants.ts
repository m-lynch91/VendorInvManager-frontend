export const BASE_URL: string = 'http://localhost:8080/api';
// export const BASE_URL: string = `/api`
export const PDF_URL: string = `${BASE_URL}/purchase-orders/pdf`;

export const API_GET: string = `${BASE_URL}/vendors`;
export const API_UPDATE: string = `${BASE_URL}/vendors`;
export const API_ADD: string = `${BASE_URL}/vendors`;
export const API_DELETE: string = `${BASE_URL}/vendors/`;

export const VENDOR_DEFAULT = {
  id: 0,
  name: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  phone: '',
  type: '',
  email: '',
};

export const PRODUCT_DEFAULT = {
  id: '',
  vendorid: 0,
  name: '',
  purchaseprice: 0,
  msrp: 0,
  reorderpoint: 0,
  economicorderquantity: 0,
  quantityonhand: 0,
  quantityonorder: 0,
  qrcode: [],
  qrcodetext: '',
};

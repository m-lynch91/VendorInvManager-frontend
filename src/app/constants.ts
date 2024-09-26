export const BASE_URL: string = 'http://localhost:8080';
export const API_GET: string = `${BASE_URL}/api/vendors`
export const API_UPDATE: string = `${BASE_URL}/api/vendors`;
export const API_ADD: string = `${BASE_URL}/api/vendors/`;
export const API_DELETE: string = `${BASE_URL}/api/vendors/`;

export const VENDOR_DEFAULT = {
	id: 0,
	name: '',
	address: '',
	city: '',
	province: '',
	postalCode: '',
    phone: '',
    type: '',
    email: ''
}
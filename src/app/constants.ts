export const BASE_URL: string = 'http://localhost:8080/api';
export const API_GET: string = `${BASE_URL}/vendors`
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
    email: ''
}
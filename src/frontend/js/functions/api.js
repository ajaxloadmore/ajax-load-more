import axios from 'axios';
const { rest_api, rest_nonce } = alm_localize;

/*
 * Create a Api object with Axios and configure it for the WordPress Rest API.
 *
 * @see https://axios-http.com/docs/instance
 */
export const api = axios.create({
	baseURL: rest_api,
	headers: {
		'content-type': 'application/json',
		'X-WP-Nonce': rest_nonce,
	},
});

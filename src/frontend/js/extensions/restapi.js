/**
 * Create params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
export function restapiParams(alm) {
	const { listing } = alm;
	alm.extensions.restapi = listing.dataset.restapi === 'true';

	if (alm.extensions.restapi) {
		alm.extensions.restapi_base_url = listing.dataset.restapiBaseUrl;
		alm.extensions.restapi_namespace = listing.dataset.restapiNamespace;
		alm.extensions.restapi_endpoint = listing.dataset.restapiEndpoint;
		alm.extensions.restapi_template_id = listing.dataset.restapiTemplateId;
		alm.extensions.restapi_debug = listing.dataset.restapiDebug;
		if (alm.extensions.restapi_template_id === '') {
			alm.extensions.restapi = false;
		}
	}

	return alm;
}

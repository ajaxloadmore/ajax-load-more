import { MD5 } from 'crypto-js';
import { api } from '../functions/api';
import { getButtonURL } from '../functions/getButtonURL';
import timeout from '../functions/timeout';

/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
export function cacheCreateParams(alm) {
	const { listing } = alm;
	alm.addons.cache = listing?.dataset?.cache === 'true';
	if (alm.addons.cache) {
		// Will be true if the "Known Users: Disable Cache for Logged In Users" setting is checked.
		alm.addons.cache_logged_in = listing.dataset.cacheLoggedIn && listing.dataset.cacheLoggedIn === 'true' ? true : false;
	}
	return alm;
}

/**
 * Get the cache ID for the given ALM instance and data.
 *
 * @param {Object} alm  The ALM object.
 * @param {Object} data The data to cache.
 * @return {string}     The cache ID.
 */
export function getCacheId(alm, data) {
	const { addons, id = '' } = alm;

	// Generate a cache ID for specific addons that perform full page fetches (Woo, Elementor, Query Loop).
	if (addons.woocommerce || addons.elementor || addons.queryloop) {
		const url = getButtonURL(alm, alm.rel); // Get the target URL.
		const settings = getAddOnSettings(alm); // Get addon settings.
		return createMD5Hash(`${url}-${id}-${settings}`); // Combine params to generate cache ID.
	}

	// Create a shallow copy of the data object so we don't modify the main data object.
	const copy = { ...data };

	// Remove the following params to prevent unnecessary cache misses on paged results.
	delete copy.page;
	delete copy.seo_start_page;
	delete copy.filters_startpage;
	delete copy.paging;
	delete copy.preloaded;
	delete copy.preloaded_amount;
	delete copy.cache;
	delete copy.cache_logged_in;
	delete copy.cache_id;

	return createMD5Hash(copy);
}

/**
 * Return MD5 hash of data.
 *
 * @param {Object} data The data to hash.
 * @return {string}     The MD5 hash.
 */
function createMD5Hash(data) {
	return MD5(JSON.stringify(data)).toString();
}

/**
 * Create a cache file.
 *
 * @param {Object}  alm      The ALM object.
 * @param {Object}  data     The data to cache.
 * @param {string}  cache_id The cache ID.
 * @param {boolean} paging   Whether the query request is for paging add-on, which returns different data shape.
 * @since 5.3.1
 */
export async function createCache(alm, data, cache_id, paging = false) {
	if (!alm.addons.cache || (alm.addons.cache && alm.addons.cache_logged_in)) {
		return; // Exit if "Disable Cache for Logged In Users" setting checked.
	}

	await timeout(500); // Add slight delay to ensure ALM rendering is complete.

	// Paging query cache.
	if (paging) {
		const res = await api.post('ajax-load-more/cache/create', {
			cache_id,
			paging: data,
		});
		if (res.status === 200 && res.data && res.data.success) {
			console.log(res.data.msg); // eslint-disable-line no-console
		}
		return;
	}

	// Standard ALM cache.
	const { html = '', meta = {}, facets = {} } = data;
	if (!html || !alm.addons.cache || (alm.addons.cache && alm.addons.cache_logged_in)) {
		return false; // Exit if missing data or "Disable Cache for Logged In Users" setting checked.
	}

	const params = {
		cache_id,
		html: html.trim(),
		postcount: meta.postcount,
		totalposts: meta.totalposts,
	};

	// Include facets if present.
	if (facets) {
		params.facets = facets;
	}

	// Create the cache file via REST API.
	const res = await api.post('ajax-load-more/cache/create', params);
	if (res.status === 200 && res.data && res.data.success) {
		console.log(res.data.msg); // eslint-disable-line no-console
	}
}

/**
 * Get cache data file.
 *
 * Note: This function is used for various addons that perform full page fetches:
 * WooCommerce, Elementor, Single Post, Query Loop, etc.
 *
 * @param {Object} alm    The ALM object.
 * @param {Object} params Query params.
 * @return {Promise}      Cache data or false.
 */
export async function getCache(alm, params) {
	if (!alm.addons.cache || !params.cache_id || (alm.addons.cache && alm.addons.cache_logged_in)) {
		return false; // Exit if missing cache ID or "Disable Cache for Logged In Users" setting checked.
	}

	const res = await api.get('ajax-load-more/cache/get', {
		params: {
			id: params.cache_id,
		},
	});

	if (res.status === 200 && res.data) {
		return res.data;
	}

	return false;
}

/**
 * Get addon settings for cache ID generation.
 *
 * @param {Object} alm The ALM object.
 * @return {string}    The addon settings as a JSON string.
 */
export function getAddOnSettings(alm) {
	const { addons } = alm;
	let settings = {};
	if (addons.elementor) {
		settings = addons?.elementor_settings?.target || {}; // Pluck unique target settings.
	}
	if (addons.woocommerce) {
		settings = addons?.woocommerce_settings?.container || {}; // Pluck unique container settings.
	}
	if (addons.queryloop) {
		settings = addons?.queryloopId || addons?.queryloop_settings?.classes?.container || {}; // Pluck unique query loop ID
	}
	return JSON.stringify(settings);
}

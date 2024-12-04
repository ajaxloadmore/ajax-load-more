import MD5 from 'crypto-js/md5';
import { api } from '../functions/api';
import { getButtonURL } from '../functions/getButtonURL';

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
		alm.addons.cache_id = listing.dataset.cacheId;
		alm.addons.cache_path = listing.dataset.cachePath;
		alm.addons.cache_logged_in = listing.dataset.cacheLoggedIn ? listing.dataset.cacheLoggedIn : false;
	}
	return alm;
}

/**
 * Create unique cache slug from query params.
 *
 * @param {Object} alm  The ALM object.
 * @param {Object} data The data object.
 * @return {string}     The cache file slug.
 */
export function getCacheSlug(alm, data) {
	const { addons, pagePrev, page, rel = 'next' } = alm;
	if (addons.nextpage) {
		// Nextpage.
		return `page-${page + addons.nextpage_startpage}`;
	} else if (addons.single_post) {
		// Single Post.
		return addons.single_post_id;
	} else if (addons.queryloop) {
		// Query Loop, use the button URL.
		return MD5(JSON.stringify(getButtonURL(alm, alm.rel))).toString();
	} else if (addons.woocommerce || addons.elementor) {
		// WooCommerce || Elementor.
		return rel === 'prev' ? `page-${pagePrev}` : `page-${page + 1}`;
	}
	return MD5(JSON.stringify(data)).toString(); // Standard.
}

/**
 * Create a cache file.
 *
 * @param {Object} alm  The ALM object.
 * @param {string} data Content to cache.
 * @param {string} name The cache slug
 * @since 5.3.1
 */
export async function createCache(alm, data, name) {
	const { html = '', meta = {} } = data;

	if (!html || !alm.addons.cache) {
		return;
	}

	const params = {
		cache_id: alm.addons.cache_id,
		cache_logged_in: alm.addons.cache_logged_in,
		canonical_url: alm.canonical_url,
		name,
		html: html.trim(),
		postcount: meta.postcount,
		totalposts: meta.totalposts,
	};

	// Create the cache file via REST API.
	const res = await api.post('ajax-load-more/cache/create', params);
	if (res.status === 200 && res.data && res.data.success) {
		console.log(res.data.msg); // eslint-disable-line no-console
	}
}

/**
 * Get cache data file.
 *
 * @param {Object} alm    The ALM object.
 * @param {Object} params Query params.
 * @return {Promise}      Cache data or false.
 */
export async function getCache(alm, params) {
	if (!alm.addons.cache || (alm.addons.cache && alm.addons.cache_logged_in)) {
		// Exit if not cache or cache is enabled but user is logged in with the no-cache setting checked.
		return false;
	}

	const restParams = {
		id: alm.addons.cache_id,
		name: params.cache_slug,
	};

	const res = await api.get('ajax-load-more/cache/get', { params: restParams });
	if (res.status === 200 && res.data) {
		return res.data;
	}

	return false;
}

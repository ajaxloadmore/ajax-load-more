import getParameterByName from '../functions/getParameterByName';
import getQueryVariable from '../functions/getQueryVariable';

/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
export function filtersCreateParams(alm) {
	const { listing } = alm;
	alm.addons.filters = alm?.listing?.dataset?.filters === 'true';
	if (alm.addons.filters) {
		alm.addons.filters_url = listing.dataset.filtersUrl === 'true';
		alm.addons.filters_target = listing.dataset.filtersTarget ? listing.dataset.filtersTarget : false;
		alm.addons.filters_paging = listing.dataset.filtersPaging === 'true';
		alm.addons.filters_scroll = listing.dataset.filtersScroll === 'true';
		alm.addons.filters_scrolltop = listing.dataset.filtersScrolltop ? listing.dataset.filtersScrolltop : '30';
		alm.addons.filters_debug = listing.dataset.filtersDebug;
		alm.facets = listing.dataset.facets === 'true';

		// Display warning when `filters_target` parameter is missing.
		if (!alm.addons.filters_target) {
			console.warn(
				'Ajax Load More: Unable to locate a target for Filters. Make sure you set a target parameter in the core Ajax Load More shortcode - e.g. [ajax_load_more filters="true" target="filters"]',
			);
		}

		// Parse querystring value for pg.
		const page = getParameterByName('pg');
		alm.addons.filters_startpage = page !== null ? parseInt(page) : 0;

		// Handle a paged URL with filters.
		if (alm.addons.filters_startpage > 0) {
			if (alm.addons.paging) {
				// Paging add-on: Set current page value.
				alm.page = alm.addons.filters_startpage - 1;
			} else {
				// Set posts_per_page value to load all required posts.
				alm.posts_per_page = alm.posts_per_page * alm.addons.filters_startpage;
				alm.paged = true;
			}
		}
	}
	return alm;
}

/**
 * Create data attributes for a Filters item.
 *
 * @param {Object}      alm     The ALM object.
 * @param {HTMLElement} element The element HTML node.
 * @param {number}      pagenum The current page number.
 * @return {HTMLElement}        Modified HTML element.
 */
export function addFiltersAttributes(alm, element, pagenum) {
	const { canonical_url } = alm;
	const querystring = window.location.search;

	element.classList.add('alm-filters');
	element.dataset.page = pagenum;

	if (pagenum > 1) {
		element.dataset.url = canonical_url + buildFilterURL(alm, querystring, pagenum);
	} else {
		element.dataset.url = canonical_url + buildFilterURL(alm, querystring, 0);
	}

	return element;
}

/**
 * Parse a filter querystring for returning caches directories.
 *
 * @param {string} path The URL path.
 * @since 5.3.1
 */
export function parseQuerystring(path) {
	// Get querystring
	const query = window.location.search.substring(1);

	let obj = '';
	let cache_dir = '';

	// Parse querystring into object
	if (query) {
		obj = JSON.parse('{"' + query.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) {
			// Replace + with - in URL
			return key === '' ? value : decodeURIComponent(value.replace(/\+/g, '-'));
		});

		// Remove the following properties from the object as they should not be included in the cache ID

		if (obj.pg) {
			// `pg` object prop
			delete obj.pg;
		}

		if (obj.auto) {
			// `auto` object prop
			delete obj.auto;
		}
	}

	if (obj) {
		cache_dir += '/';
		Object.keys(obj).forEach((key, index) => {
			cache_dir += index > 0 ? '--' : '';
			cache_dir += `${key}--${obj[key]}`;
		});
	}

	return path + cache_dir;
}

/**
 * Build new paging URL for filters.
 *
 * @param {Object} alm         The ALM object.
 * @param {string} querystring The current querystring.
 * @param {number} page        The page number.
 * @return {string}            The querystring.
 * @since 5.3.5
 */
export function buildFilterURL(alm, querystring = '', page = 0) {
	let qs = querystring;
	if (alm.addons.filters_paging) {
		if (page > 1) {
			// Paged
			if (qs) {
				// If already has `pg` in querystring
				if (getQueryVariable('pg')) {
					qs = querystring.replace(/(pg=)[^\&]+/, '$1' + page);
				} else {
					qs = querystring + '&pg=' + page;
				}
			} else {
				qs = '?pg=' + page;
			}
		} else {
			// Not Paged
			qs = querystring.replace(/(pg=)[^\&]+/, '');
			qs = qs === '?' ? '' : qs; // Remove `?` if only symbol in querystring
			qs = qs[qs.length - 1] === '&' ? qs.slice(0, -1) : qs; // Remove trailing `&` symbols
		}
	}
	return qs;
}

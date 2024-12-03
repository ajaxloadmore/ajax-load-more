import stripEmptyNodes from '../functions/stripEmptyNodes';
import { addFiltersAttributes } from './filters';
import { addSEOAttributes } from './seo';

/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
export function preloadedCreateParams(alm) {
	const { listing, addons } = alm;
	alm.addons.preloaded = listing.dataset.preloaded === 'true';
	alm.addons.preloaded_amount = listing?.dataset?.preloadedAmount ? parseInt(listing.dataset.preloadedAmount) : alm.posts_per_page;
	if (!alm.addons.preloaded) {
		alm.addons.preloaded_amount = 0;
	}

	if (addons.preloaded) {
		if (alm?.localize) {
			// Disable ALM if total_posts is equal to or less than preloaded_amount.
			const { total_posts = 0 } = alm.localize;
			if (parseInt(total_posts) <= addons.preloaded_amount) {
				alm.addons.preloaded_total_posts = parseInt(total_posts);
				alm.disable_ajax = true;
			}
		}
	}
	return alm;
}

/**
 * Set parameters on HTML elements for preloaded results.
 *
 * @param {Object} alm The ALM object.
 * @since 7.0.0
 */
export function setPreloadedParams(alm) {
	const { addons, listing } = alm;
	if (addons.paging) {
		return; // Exit if paging.
	}

	// Parse preloaded data into array of HTML elements.
	const data = stripEmptyNodes([...listing?.childNodes]);

	// Get first element in the data array.
	const firstElement = data?.length && data[0] ? data[0] : false;

	if (firstElement) {
		if (addons?.seo) {
			addSEOAttributes(alm, firstElement, 1);
		}
		if (addons?.filters) {
			addFiltersAttributes(alm, firstElement, 1);
		}
	}
}

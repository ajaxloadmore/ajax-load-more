import { API_DATA_SHAPE } from '../functions/constants';
import { createCache } from './cache';

/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
export function singlepostsCreateParams(alm) {
	const { listing } = alm;
	alm.addons.single_post = listing?.dataset?.singlePost === 'true';
	if (alm.addons.single_post) {
		alm.addons.single_post_id = listing.dataset.singlePostId;
		alm.addons.single_post_query = listing.dataset.singlePostQuery;
		alm.addons.single_post_order = listing.dataset.singlePostOrder === undefined ? 'previous' : listing.dataset.singlePostOrder;
		alm.addons.single_post_init_id = listing.dataset.singlePostId;
		alm.addons.single_post_taxonomy = listing.dataset.singlePostTaxonomy === undefined ? '' : listing.dataset.singlePostTaxonomy;
		alm.addons.single_post_excluded_terms = listing.dataset.singlePostExcludedTerms === undefined ? '' : listing.dataset.singlePostExcludedTerms;
		alm.addons.single_post_progress_bar = listing.dataset.singlePostProgressBar === undefined ? '' : listing.dataset.singlePostProgressBar;
		alm.addons.single_post_target = listing.dataset.singlePostTarget === undefined ? '' : listing.dataset.singlePostTarget;
		alm.addons.single_post_preview = listing.dataset.singlePostPreview === undefined ? false : true;

		// Post Preview. Does this even work?
		if (alm.addons.single_post_preview) {
			const singlePostPreviewData = listing.dataset.singlePostPreview.split(':');
			alm.addons.single_post_preview_data = {
				button_label: singlePostPreviewData[0] ? singlePostPreviewData[0] : 'Continue Reading',
				height: singlePostPreviewData[1] ? singlePostPreviewData[1] : 500,
				element: singlePostPreviewData[2] ? singlePostPreviewData[2] : 'default',
				className: 'alm-single-post--preview',
			};
		}

		if (alm.addons.single_post_id === undefined) {
			alm.addons.single_post_id = '';
			alm.addons.single_post_init_id = '';
		}

		// Set default fallbacks.
		alm.addons.single_post_permalink = '';
		alm.addons.single_post_title = '';
		alm.addons.single_post_slug = '';
		alm.addons.single_post_cache = false;
		alm.addons.single_post_title_template = listing.dataset.singlePostTitleTemplate;
		alm.addons.single_post_siteTitle = listing.dataset.singlePostSiteTitle;
		alm.addons.single_post_siteTagline = listing.dataset.singlePostSiteTagline;
		alm.addons.single_post_scroll = listing.dataset.singlePostScroll;
		alm.addons.single_post_scroll_speed = listing.dataset.singlePostScrollSpeed;
		alm.addons.single_post_scroll_top = listing.dataset.singlePostScrolltop;
		alm.addons.single_post_controls = listing.dataset.singlePostControls;
	}
	return alm;
}

/**
 * Create the HTML for loading Single Posts.
 *
 * @param {Object} alm        The alm object.
 * @param {Object} response   Query response.
 * @param {string} cache_slug The cache slug.
 * @return {Object}           Results data.
 * @since 5.1.8.1
 */
export function singlepostsHTML(alm, response, cache_slug) {
	const data = API_DATA_SHAPE;
	const { status, data: resData } = response;
	const { single_post_target, single_post_id } = alm.addons; // Get target elements.

	if (status !== 200 || !resData || !single_post_target) {
		return data; // Bail early if response is not OK or empty.
	}

	// Create temp div to hold response data.
	const div = document.createElement('div');
	div.innerHTML = resData;

	// Get target element.
	const html = div.querySelector(single_post_target);

	if (!html) {
		console.warn(`Ajax Load More: Unable to find ${single_post_target} element.`);
		return data;
	}

	// Get any custom target elements.
	if (window?.almSinglePostsCustomElements) {
		const customElements = singlepostsGetCustomElements(div, window?.almSinglePostsCustomElements, single_post_id);
		if (customElements) {
			// Get first element in HTML.
			const target = html.querySelector('article, section, div');
			if (target) {
				target.appendChild(customElements);
			}
		}
	}

	data.html = html.innerHTML;
	data.meta = {
		postcount: 1,
		totalposts: 1,
	};

	createCache(alm, data, cache_slug); // Create cache file.
	return data;
}

/**
 * Find nested Next Page instance and prepend first element to the returned HTML.
 *
 * @param {Element} html The wrapper element.
 * @return {Element}     The modified element.
 */
export function getNestedNextPageElement(html) {
	const nextpageElement = html.querySelector('.ajax-load-more-wrap .alm-nextpage');
	if (!nextpageElement) {
		return html;
	}

	// Clone the nextpage element and clear the contents.
	const clone = nextpageElement.cloneNode(true);
	clone.innerHTML = '';

	// Insert the clone before the first child.
	html.insertBefore(clone, html.querySelector(':first-child'));

	return html;
}

/**
 * Collect custom target elements and append them to the returned HTML.
 * This function is useful to get elements from outside the ALM target and bring them into the returned HTML.
 * Useful for when CSS or JS may be loaded in the <head/> and we need it brought into the HTML for Single Posts.
 *
 * e.g. window.almSinglePostsCustomElements = ['#woocommerce-inline-inline-css', '#wc-block-style-css'];
 *
 * @param {HTMLElement}   content        The HTML element.
 * @param {Array}         customElements The elements to search for in content.
 * @param {string|number} id             The Post ID.
 * @return {HTMLElement}                 The HTML elements.
 */
function singlepostsGetCustomElements(content = '', customElements = [], id) {
	if (!content || !customElements) {
		return container; // Exit if empty.
	}

	// Create container element if if doesn't exist.
	const container = document.createElement('div');
	container.classList.add('alm-custom-elements');
	container.dataset.id = id;

	// Convert customElements to an Array.
	customElements = !Array.isArray(customElements) ? [customElements] : customElements;

	// Loop Array to extract elements and append to container.
	for (let i = 0; i < customElements.length; i++) {
		const element = content.querySelector(customElements[i]);
		if (element) {
			element.classList.add('alm-custom-element');
			container.appendChild(element);
		}
	}

	return container;
}

/**
 * Create data attributes for a Single Post item.
 *
 * @param {Object}  alm     The ALM object.
 * @param {Element} element The elements HTML element to add data params.
 * @return {Array}          Modified HTML element.
 */
export function addSinglePostsAttributes(alm, element) {
	if (!element) {
		return [];
	}

	const { page, addons } = alm;

	const { retain_querystring = true } = alm_localize;
	const querystring = retain_querystring ? window.location.search : '';
	console.log(querystring);

	element.setAttribute('class', `alm-single-post post-${addons.single_post_id}`);
	element.dataset.id = addons.single_post_id;
	element.dataset.url = `${addons.single_post_permalink}${querystring}`;
	element.dataset.page = addons.single_post_target ? parseInt(page) + 1 : page;
	element.dataset.title = addons.single_post_title;
	return element;
}

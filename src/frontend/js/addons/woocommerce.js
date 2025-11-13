import axios from 'axios';
import { API_DEFAULT_DATA_SHAPE } from '../functions/constants';
import dispatchScrollEvent from '../functions/dispatchScrollEvent';
import { setButtonAtts } from '../functions/getButtonURL';
import { setContentContainersParams } from '../functions/setContentParams';
import { lazyImages } from '../modules/lazyImages';
import loadItems from '../modules/loadItems';
import { createLoadPreviousButton } from '../modules/loadPrevious';

/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
export function wooCreateParams(alm) {
	const { listing, addons } = alm;
	alm.addons.woocommerce = listing?.dataset?.woo === 'true';
	if (alm.addons.woocommerce && listing.dataset.wooSettings) {
		alm.addons.woocommerce_settings = JSON.parse(listing.dataset.wooSettings);
		alm.addons.woocommerce_settings.results_text = document.querySelectorAll(addons?.woocommerce_settings?.results); // Add Results Text
		alm.page = parseInt(alm.page) + parseInt(addons.woocommerce_settings.paged);
	}
	return alm;
}

/**
 * Set up instance of ALM WooCommerce
 *
 * @param {Object} alm ALM object.
 * @since 5.3.0
 */
export function wooInit(alm) {
	if (!alm || !alm.addons.woocommerce) {
		return false;
	}

	const container = document.querySelector(alm.addons.woocommerce_settings.container); // Get `ul.products`
	if (!container) {
		console.warn(
			'ALM WooCommerce: Unable to locate container element. Get more information -> https://connekthq.com/plugins/ajax-load-more/docs/add-ons/woocommerce/#alm_woocommerce_container'
		);
		return;
	}

	alm.button.dataset.page = alm.addons.woocommerce_settings.paged + 1; // Page

	// Get upcoming URL.
	const nextPage = alm.addons.woocommerce_settings.paged_urls[alm.addons.woocommerce_settings.paged];
	if (nextPage) {
		alm.button.dataset.url = nextPage;
	} else {
		alm.button.dataset.url = '';
	}

	const count = countContainers(alm.addons.woocommerce_settings.container);
	const page = alm.addons.woocommerce_settings.paged;

	if (count > 1) {
		// Display warning if multiple containers were found.
		console.warn(
			'ALM WooCommerce: Multiple containers with the same classname or ID found. The WooCommerce add-on requires a single container to be defined. Get more information -> https://connekthq.com/plugins/ajax-load-more/docs/add-ons/woocommerce/'
		);
	}

	// Set attributes on containers.
	setContentContainersParams(container, alm.listing);

	// Set data attributes on first item.
	const item = container.querySelector(alm.addons.woocommerce_settings.products); // Get first `.product` item
	if (item) {
		item.classList.add('alm-woocommerce');
		item.dataset.url = alm.addons.woocommerce_settings.paged_urls[alm.addons.woocommerce_settings.paged - 1];
		item.dataset.page = alm.page;
		item.dataset.pageTitle = document.title;
	} else {
		console.warn(
			'ALM WooCommerce: Unable to locate products. Get more information -> https://connekthq.com/plugins/ajax-load-more/docs/add-ons/woocommerce/#alm_woocommerce_products'
		);
	}

	// Paged URL: Create previous button.
	if (page > 1 && alm.addons.woocommerce_settings.settings.previous_products) {
		const prevURL = alm.addons.woocommerce_settings.paged_urls[page - 2];
		const label = alm.addons.woocommerce_settings.settings.previous_products;
		createLoadPreviousButton(alm, container, page - 1, prevURL, label);
	}
}

/**
 * Core ALM WooCommerce product loader
 *
 * @param {Element} content WooCommerce content container.
 * @param {Object}  alm     ALM object.
 * @since 5.3.0
 */
export function woocommerce(content, alm) {
	if (!content || !alm) {
		return false;
	}

	return new Promise((resolve) => {
		const { woocommerce_settings = {} } = alm.addons;
		const { settings = {} } = woocommerce_settings;

		const container = document.querySelector(woocommerce_settings.container); // Get `ul.products`
		const products = content.querySelectorAll(woocommerce_settings.products); // Get all `.products`
		const waitForImages = settings && settings.images_loaded === 'true' ? true : false;

		if (container && products) {
			const wooProducts = Array.prototype.slice.call(products); // Convert NodeList to Array.

			// Load the items.
			(async function () {
				await loadItems(container, wooProducts, alm, waitForImages);
				resolve(true);
			})().catch((e) => {
				console.warn(e, 'There was an error with WooCommerce'); // eslint-disable-line no-console
			});

			// Trigger almWooCommerceLoaded callback.
			if (typeof almWooCommerceLoaded === 'function') {
				window.almWooCommerceLoaded(products);
			}
		}
	});
}

/**
 * Get the content, title and results from the Ajax request.
 *
 * @param {Object} alm  The alm object.
 * @param {string} url  The request URL.
 * @param {string} html The HTML data as a string.
 * @return {Object}     Results data.
 * @since 5.3.0
 */
export function wooGetContent(alm, url, html = '') {
	if (!html) {
		return API_DEFAULT_DATA_SHAPE; // Bail early if missing html content.
	}

	const { addons, pagePrev, rel = 'next', page, localize } = alm;
	const { total_posts } = localize;
	const { woocommerce_settings = {} } = addons;

	// Get the page number.
	const currentPage = rel === 'prev' ? pagePrev : page + 1;

	// Create temp div to hold html data.
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = html;

	// Get WooCommerce products container.
	const container = tempDiv.querySelector(woocommerce_settings.container);
	if (!container) {
		console.warn(`Ajax Load More WooCommerce: Unable to find WooCommerce ${woocommerce_settings.container} element.`);
		return API_DEFAULT_DATA_SHAPE;
	}

	// Get the returned items.
	const items = container.querySelectorAll(woocommerce_settings.products);
	if (items) {
		// Set first item data attributes.
		items[0].classList.add('alm-woocommerce');
		items[0].dataset.url = url;
		items[0].dataset.page = currentPage;
		items[0].dataset.pageTitle = tempDiv.querySelector('title').innerHTML;

		// Update the results Text.
		almWooCommerceResultsText(tempDiv, alm);

		// Return data object.
		return {
			html: container.innerHTML,
			meta: {
				postcount: items.length,
				totalposts: total_posts,
			},
		};
	}

	return API_DEFAULT_DATA_SHAPE; // Return default data shape if no items found.
}

/**
 * Handle WooCommerce loaded functionality and dispatch actions.
 *
 * @param {Object} alm ALM object.
 * @since 5.5.0
 */
export function woocommerceLoaded(alm) {
	const { addons } = alm;

	const nextPageNum = alm.page + 2;
	const nextPage = addons.woocommerce_settings.paged_urls[nextPageNum - 1]; // Get URL.

	// Set button state & URL.
	if (alm.rel === 'prev' && alm.buttonPrev) {
		const prevPage = addons.woocommerce_settings.paged_urls[alm.pagePrev - 2];
		setButtonAtts(alm.buttonPrev, parseInt(alm.pagePrev) - 1, prevPage);
	} else {
		setButtonAtts(alm.button, nextPageNum, nextPage);
	}

	// Lazy load images if necessary.
	lazyImages(alm);

	// Trigger almComplete.
	if (typeof almComplete === 'function' && alm.transition !== 'masonry') {
		window.almComplete(alm);
	}

	// End transitions.
	alm.AjaxLoadMore.transitionEnd();

	// ALM Done.
	if (alm.rel === 'prev' && alm.pagePrev <= 1) {
		alm.AjaxLoadMore.triggerDonePrev();
	}
	if (alm.rel === 'next' && nextPageNum > parseInt(alm.addons.woocommerce_settings.pages)) {
		alm.AjaxLoadMore.triggerDone();
	}

	dispatchScrollEvent();
}

/**
 * Reset a WooCommerce Instance by hitting the updated site URL.
 *
 * @since 5.3.8
 */
export function wooReset() {
	return new Promise((resolve) => {
		const url = window.location;
		axios
			.get(url)
			.then((response) => {
				if (response.status === 200 && response.data) {
					const div = document.createElement('div');
					div.innerHTML = response.data; // Add data to div

					const alm = div.querySelector('.ajax-load-more-wrap .alm-listing[data-woo="true"]'); // Get ALM instance
					const settings = alm ? alm.dataset.wooSettings : ''; // Get settings data
					resolve(settings);
				} else {
					resolve(false);
				}
			})
			.catch(function () {
				resolve(false);
			});
	});
}

/**
 * Set results text for WooCommerce Add-on.
 *
 * @param {Element} target The target HTML element.
 * @param {Object}  alm    ALM object.
 * @since 5.3
 */
function almWooCommerceResultsText(target = '', alm) {
	if (target && alm && alm.addons.woocommerce_settings.results_text) {
		const currentResults = target.querySelector(alm.addons.woocommerce_settings.results);

		if (alm.addons.woocommerce_settings.results_text) {
			//let link = alm.addons.woocommerce_settings.settings.previous_page_link;
			//let label = alm.addons.woocommerce_settings.settings.previous_page_label;
			//let sep = alm.addons.woocommerce_settings.settings.previous_page_sep;
			alm.addons.woocommerce_settings.results_text.forEach((element) => {
				element.innerHTML = currentResults.innerHTML;
				// if (link && label) {
				// 	element.innerHTML = returnButton(currentResults, link, label, sep);
				// } else {
				// 	element.innerHTML = currentResults.innerHTML;
				// }
			});
		}
	}
}

/**
 * Initiate Results text.
 *
 * @param {Object} alm ALM object.
 * @since 5.3
 * @deprecated 5.5
 */
export function almWooCommerceResultsTextInit(alm) {
	if (alm && alm.addons.woocommerce_settings.results_text) {
		const results = document.querySelectorAll(alm.addons.woocommerce_settings.results);
		if (results.length < 1) {
			return false;
		}
		const link = alm.addons.woocommerce_settings.settings.previous_page_link;
		const label = alm.addons.woocommerce_settings.settings.previous_page_label;
		const sep = alm.addons.woocommerce_settings.settings.previous_page_sep;
		// Loop all result text elements
		results.forEach((element) => {
			if (link && label) {
				element.innerHTML = returnButton(element, link, label, sep);
			}
		});
	}
}

/**
 * Create button text for returning to the first page
 *
 * @param {Element} text      The button text.
 * @param {string}  link      Link URL.
 * @param {string}  label     Button label.
 * @param {string}  seperator HTML separator.
 */
function returnButton(text, link, label, seperator) {
	const button = ` ${seperator} <a href="${link}">${label}</a>`;
	return text.innerHTML + button;
}

/**
 * Get total count of WooCommerce containers.
 *
 * @param {string} container The container class.
 * @return {number}          The total number of containers.
 */
function countContainers(container) {
	if (!container) {
		return 0;
	}

	const containers = document.querySelectorAll(container); // Get all containers.
	if (!containers) {
		return 0;
	}
	return containers.length;
}

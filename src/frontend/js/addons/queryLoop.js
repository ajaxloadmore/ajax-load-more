import { API_DATA_SHAPE } from '../functions/constants';
import dispatchScrollEvent from '../functions/dispatchScrollEvent';
import { setButtonAtts } from '../functions/getButtonURL';
import { lazyImages } from '../modules/lazyImages';
import loadItems from '../modules/loadItems';
import { createCache } from './cache';

/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object|null}    The modified object.
 */
export function queryLoopCreateParams(alm) {
	const { main } = alm;
	const blockClassname = 'wp-block-query';

	// Get the parent container.
	const container = main.closest(`.${blockClassname}`);

	// If parent is not a .wp-block-query, return alm.
	if (!container) {
		return alm;
	}

	// If parent is a wp-block-query, set queryloop settings.
	alm.addons.queryloop = true;
	alm.addons.queryloop_settings = {
		container,
		classes: {
			container: `.${container.className.replace(/ /g, '.')}`,
			listing: '.wp-block-post-template',
			element: '.wp-block-post',
			pagination: '.wp-block-query-pagination',
			pagination_prev: 'a.wp-block-query-pagination-previous',
			pagination_next: 'a.wp-block-query-pagination-next',
		},
		pagination: container.querySelector('.wp-block-query-pagination'),
		pagination_prev: container.querySelector('a.wp-block-query-pagination-previous'),
		pagination_next: container.querySelector('a.wp-block-query-pagination-next'),
	};

	return alm;
}

/**
 * Set up the instance of Query Loop.
 *
 * @param {Object} alm
 */
export function queryLoopInit(alm) {
	const { rel, addons, button, buttonPrev, page } = alm;
	const { queryloop_settings: settings = {} } = addons;

	// Set button state & URL.
	if (rel === 'prev' && buttonPrev) {
		const prevURL = settings?.pagination_prev?.href || false;
		if (prevURL) {
			setButtonAtts(buttonPrev, page - 1, prevURL);
		} else {
			alm.AjaxLoadMore.triggerDonePrev();
		}
	} else {
		const nextURL = settings?.pagination_next?.href || false;
		if (nextURL) {
			setButtonAtts(button, page + 1, nextURL);
		} else {
			alm.AjaxLoadMore.triggerDone();
		}
	}
}

/**
 * Get the content, title and results text from the Ajax response.
 *
 * @param {Object} alm        The alm object.
 * @param {string} url        The request URL.
 * @param {Object} response   Query response.
 * @param {string} cache_slug The cache slug.
 * @return {Object}           Results data.
 */
export function queryLoopGetContent(alm, url, response, cache_slug) {
	const data = API_DATA_SHAPE; // Default data object.

	// Successful response.
	if (response.status === 200 && response.data) {
		const { addons, page, button, buttonPrev, rel } = alm;
		const { queryloop_settings = {} } = addons;

		// Create temp div to hold response data.
		const content = document.createElement('div');
		content.innerHTML = response.data;

		// Set button state & URL.
		if (rel === 'prev' && buttonPrev) {
			const prevURL = getPagedURL(queryloop_settings, content, 'prev');
			if (prevURL) {
				setButtonAtts(buttonPrev, page - 1, prevURL);
			} else {
				alm.AjaxLoadMore.triggerDonePrev();
			}
		} else {
			const nextURL = getPagedURL(queryloop_settings, content);
			if (nextURL) {
				setButtonAtts(button, page + 1, nextURL);
			} else {
				alm.AjaxLoadMore.triggerDone();
			}
		}

		// Get Page Title
		const title = content.querySelector('title').innerHTML;
		data.pageTitle = title;

		// Get container.
		const container = content?.querySelector(`${queryloop_settings?.classes?.container} ${queryloop_settings?.classes?.listing}`);
		if (!container) {
			console.warn('Ajax Load More: Unable to locate Query Loop container.');
			return data;
		}

		// Get the first item and append data attributes.
		const item = container ? container.querySelector(queryloop_settings?.classes?.element) : null;
		if (item) {
			item.classList.add('alm-queryloop');
			item.dataset.url = url;
			item.dataset.page = rel === 'next' ? page + 1 : page - 1;
			item.dataset.pageTitle = title;
		}

		// Count the number of returned items.
		const items = container.querySelectorAll(queryloop_settings?.classes?.element);
		if (items) {
			// Set the html to the elementor container data.
			data.html = container ? container.innerHTML : '';
			data.meta.postcount = items.length;
			data.meta.totalposts = items.length;

			// Create cache file.
			createCache(alm, data, cache_slug);
		}
	}
	return data;
}

/**
 * Core ALM Query Loop loader.
 *
 * @param {HTMLElement} content The HTML data.
 * @param {Object}      alm     The alm object.
 */
export function queryloop(content, alm) {
	if (!content || !alm) {
		alm.AjaxLoadMore.triggerDone();
		return false;
	}

	return new Promise((resolve) => {
		const { addons } = alm;
		const { queryloop_settings = {} } = addons;

		// Get post listing container.
		const container = queryloop_settings?.container?.querySelector(`${queryloop_settings.classes.listing}`);

		// Get all individual items in Ajax response.
		const items = content.querySelectorAll(`${queryloop_settings?.classes?.element}`);

		if (container && items) {
			const queryloopItems = Array.prototype.slice.call(items); // Convert NodeList to Array

			// Trigger almQueryLoopLoaded callback.
			if (typeof almQueryLoopLoaded === 'function') {
				window.almQueryLoopLoaded(queryloopItems);
			}

			// Load the items.
			(async function () {
				await loadItems(container, queryloopItems, alm);
				resolve(true);
			})().catch((e) => {
				console.warn(e, 'There was an error with Query Loop'); // eslint-disable-line no-console
			});
		} else {
			resolve(false);
		}
	});
}

/**
 * Query Loop loaded and dispatch actions.
 *
 * @param {Object} alm The alm object.
 */
export function queryloopLoaded(alm) {
	const { page, AjaxLoadMore, addons } = alm;
	const nextPage = page + 1;

	const max_pages = addons.elementor_max_pages;

	// Lazy load images if necessary.
	lazyImages(alm);

	// Trigger almComplete.
	if (typeof almComplete === 'function' && alm.transition !== 'masonry') {
		window.almComplete(alm);
	}

	// End transitions.
	AjaxLoadMore.transitionEnd();

	// ALM Done.
	if (nextPage >= max_pages) {
		AjaxLoadMore.triggerDone();
	}

	dispatchScrollEvent();
}

/**
 * Get the pagination container for the Elementor pagination.
 *
 * @param {Object}  settings The query loop settings object.
 * @param {Element} content  The HTML content to search.
 * @param {string}  dir      the direction, next of prev.
 * @return {HTMLElement}     The pagination element.
 */
function getPagedURL(settings, content, dir = 'next') {
	// Locate the pagination container.
	const pagination = content?.querySelector(`${settings.classes.container} ${settings.classes.pagination}`);

	// Get the pagination target class.
	const target = dir === 'next' ? settings.classes?.pagination_next : settings.classes?.pagination_prev;

	// Get the next URL from the pagination element.
	const page = pagination?.querySelector(target)?.href;

	// Return the next page URL.
	return page ? page : false;
}

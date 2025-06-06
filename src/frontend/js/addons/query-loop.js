import { API_DATA_SHAPE } from '../functions/constants';
import dispatchScrollEvent from '../functions/dispatchScrollEvent';
import { setButtonAtts } from '../functions/getButtonURL';
import { lazyImages } from '../modules/lazyImages';
import loadItems from '../modules/loadItems';
import { createLoadPreviousButton } from '../modules/loadPrevious';
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

	// Pluck the queryId from the config.
	const { queryId = false, paged = 1 } = getQueryLoopConfig(container);
	if (!queryId) {
		console.warn('Ajax Load More: Unable to locate Query Loop ID.');
		return alm;
	}

	alm.addons.queryloop = true;
	alm.addons.queryloopId = queryId;
	alm.addons.queryloop_settings = {
		container,
		firstEl: container.querySelector('.wp-block-post'),
		classes: {
			container: `.${container.className.replace(/ /g, '.')}`,
			listing: '.wp-block-post-template',
			element: '.wp-block-post',
		},
	};

	alm.page = parseInt(paged);
	alm.pause = 'true'; // Pause ALM by default.
	return alm;
}
/**
 * Init the Query Loop functionality.
 * @param {Object} alm The alm object.
 */
export function queryLoopInit(alm) {
	const { queryloop_settings = {} } = alm.addons;
	const { container = '', firstEl: first } = queryloop_settings;
	const { paged = 1, prev } = getQueryLoopConfig(container);

	// Create Load Previous button.
	if (container && paged > 1 && prev) {
		createLoadPreviousButton(alm, container, paged - 1, prev, alm?.prev_button_labels?.default);
	}

	// Config first element in list.
	if (first) {
		first.classList.add('alm-query-loop');
		first.dataset.url = window.location.href;
		first.dataset.page = alm.page;
		first.dataset.title = document.querySelector('title').innerHTML;
	}

	// Set button URLs.
	setButtonURLs(alm);

	// Attach scroll events.
	if (alm.urls) {
		window.addEventListener('touchstart', onScroll);
		window.addEventListener('scroll', onScroll);
	}
}

/**
 * Set the button URLs.
 *
 * @param {Object}      alm     The alm object.
 * @param {HTMLElement} element The element to search.
 */
function setButtonURLs(alm, element = document) {
	const { rel, button, buttonPrev, page, pagePrev = 1 } = alm;
	const { next = '', prev = '' } = getQueryLoopConfig(element);

	// Set button state & URL.
	if (rel === 'prev' && buttonPrev) {
		if (prev) {
			setButtonAtts(buttonPrev, pagePrev - 1, prev);
		} else {
			alm.AjaxLoadMore.triggerDonePrev();
		}
	} else {
		if (next) {
			setButtonAtts(button, page + 1, next);
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
	const data = API_DATA_SHAPE;
	const { status, data: resData } = response;

	if (status !== 200 || !resData) {
		return data; // Bail early if response is not OK or empty.
	}

	const { addons, canonical_url } = alm;
	const { queryloop_settings = {} } = addons;

	// Create temp div to hold response data.
	const content = document.createElement('div');
	content.innerHTML = resData;

	// Get container.
	const container = content?.querySelector(`${queryloop_settings?.classes?.container} ${queryloop_settings?.classes?.listing}`);
	if (!container) {
		console.warn('Ajax Load More: Unable to locate Query Loop container.');
		return data;
	}

	// Get the first item and append data attributes.
	const item = container ? container.querySelector(queryloop_settings?.classes?.element) : null;
	if (item) {
		// Get current page from config settings.
		const { paged = 1 } = getQueryLoopConfig(content);

		item.classList.add('alm-query-loop');
		item.dataset.url = paged > 1 ? url : canonical_url;
		item.dataset.page = paged;
		item.dataset.title = content.querySelector('title').innerHTML;
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

	// Set the button URLs.
	alm.page = alm.page + 1;
	setButtonURLs(alm, content);

	return data;
}

/**
 * Core ALM Query Loop loader.
 *
 * @param {HTMLElement} content The HTML data.
 * @param {Object}      alm     The alm object.
 */
export function queryLoop(content, alm) {
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

			// Trigger almqueryLoopLoaded callback.
			if (typeof almqueryLoopLoaded === 'function') {
				window.almqueryLoopLoaded(queryloopItems);
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
export function queryLoopLoaded(alm) {
	const { AjaxLoadMore } = alm;

	lazyImages(alm); // Lazy load images if necessary.

	if (typeof almComplete === 'function' && alm.transition !== 'masonry') {
		window.almComplete(alm); // Trigger almComplete.
	}

	AjaxLoadMore.transitionEnd(); // End transitions.
	dispatchScrollEvent();
}

/**
 * Get the `<pre/>` config element.
 *
 * @param {HTMLElement} element The element to search.
 * @return {Object|void}        The config object.
 */
function getQueryLoopConfig(element) {
	const raw = element?.querySelector('pre[data-rel="ajax-load-more"]');
	if (!raw) {
		return {};
	}
	return JSON.parse(raw?.innerHTML);
}

/**
 * Scroll and touchstart events.
 *
 * @since 2.0
 */
function onScroll() {
	const scrollTop = window.scrollY;
	const disabled = false;
	if (!disabled) {
		// Get all elements.
		const posts = document.querySelectorAll('.alm-query-loop');
		if (!posts) {
			return;
		}

		const first = posts[0]?.dataset?.url;

		// Get container scroll position
		const fromTop = scrollTop;

		// Loop all posts
		const current = Array.prototype.filter.call(posts, function (n) {
			const divOffset = ajaxloadmore.getOffset(n);
			if (divOffset.top < fromTop) {
				return n;
			}
		});

		// Get the data attributes of the current element.
		const currentPost = current[current.length - 1];
		const title = currentPost ? currentPost.dataset.title : '';
		const permalink = currentPost ? currentPost.dataset.url : '';

		const url = permalink || first;

		if (window.location.href !== url) {
			// Set URL if current post doesn't match the browser URL.
			setURL(title, url);
		}
	}
}

/**
 * Set the URL in the browser.
 *
 * @param {string} title     Page title.
 * @param {string} permalink The permalink.
 */
function setURL(title, permalink) {
	const state = {
		permalink,
		title,
	};
	history.replaceState(state, title, permalink);
}

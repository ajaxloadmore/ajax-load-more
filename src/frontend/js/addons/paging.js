import insertScript from '../modules/insertScript';

/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
export function pagingCreateParams(alm) {
	const { listing, container_type } = alm;
	alm.addons.paging = listing.dataset.paging === 'true';
	if (alm.addons.paging) {
		alm.addons.paging_init = true;
		alm.addons.paging_controls = listing.dataset.pagingControls === 'true';
		alm.addons.paging_show_at_most = listing.dataset.pagingShowAtMost ? parseInt(listing.dataset.pagingShowAtMost) : 6;
		alm.addons.paging_classes = listing.dataset.pagingClasses;

		alm.addons.paging_first_label = listing.dataset.pagingFirstLabel;
		alm.addons.paging_previous_label = listing.dataset.pagingPreviousLabel;
		alm.addons.paging_next_label = listing.dataset.pagingNextLabel;
		alm.addons.paging_last_label = listing.dataset.pagingLastLabel;

		alm.addons.paging_scroll = listing.dataset.pagingScroll ? listing.dataset.pagingScroll : false;
		alm.addons.paging_scrolltop = listing.dataset.pagingScrolltop ? parseInt(listing.dataset.pagingScrolltop) : 100;
		alm.addons.paging_container = container_type === 'table' ? listing : listing.querySelector('.alm-paging-content');

		alm.pause = alm.addons.preloaded ? true : alm.pause; // If preloaded, pause ALM.
	}
	return alm;
}

/**
 * Function dispatched after paging content has been loaded.
 *
 * @param {Object}  alm              The alm object.
 * @param {boolean} alm_is_filtering Is ALM filtering.
 * @param {boolean} init             Is first run.
 */
export function pagingComplete(alm, alm_is_filtering = false, init = false) {
	const { main, AjaxLoadMore, last_loaded } = alm;

	main.classList.remove('alm-loading');
	AjaxLoadMore.triggerAddons(alm);

	if (init) {
		if (typeof almPagingComplete === 'function') {
			window.almPagingComplete();
		}
	} else {
		// Dispatch almOnPagingComplete callback when not alm.init.
		if (typeof almOnPagingComplete === 'function') {
			window.almOnPagingComplete(alm); // Callback: Paging Add-on Complete.
		}
	}

	if (alm_is_filtering && alm.addons.filters && typeof almFiltersAddonComplete === 'function') {
		window.almFiltersAddonComplete(main); // Callback: Filters Add-on Complete
	}

	if (typeof almComplete === 'function') {
		window.almComplete(alm); // Callback: ALM Complete
	}

	// Trigger <script /> tags in templates.
	insertScript.init(last_loaded);
}

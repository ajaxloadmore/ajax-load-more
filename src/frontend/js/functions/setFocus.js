/**
 * Set user focus to improve accessibility after load events.
 *
 * @param {Object}  alm          ALM object.
 * @param {Element} element      The element to focus on.
 * @param {number}  total        The total number of posts returned.
 * @param {boolean} is_filtering Is this a filtering event.
 * @since 5.1
 */
export default function setFocus(alm, element = null, total = 0, is_filtering = false) {
	if (!alm_localize?.a11y_focus || !element) {
		return;
	}

	// WooCommerce||Elementor Add-ons.
	if (alm?.addons?.woocommerce || alm?.addons?.elementor) {
		moveFocus(false, false, element, false);
		return;
	}

	if (total < 1) {
		return; // Exit if no posts returned.
	}

	if (alm.addons.paging) {
		// Paging.
		moveFocus(alm.init, alm.addons.preloaded, alm.listing, is_filtering);
	} else if (alm.addons.single_post || alm.addons.nextpage) {
		// Single Posts || Next Page - Set `init` to false to trigger focus.
		moveFocus(false, alm.addons.preloaded, element, is_filtering);
	} else {
		// Standard.
		moveFocus(alm.init, alm.addons.preloaded, element, is_filtering);
	}
}

/**
 * Move user focus to latest elements that have been loaded.
 *
 * @param {boolean} init         Initial run true or false.
 * @param {string}  preloaded    Preloaded true or false.
 * @param {Element} element      The container HTML element.
 * @param {boolean} is_filtering Filtering true or false.
 * @since 5.1
 */

function moveFocus(init = true, preloaded = 'false', element, is_filtering = false) {
	if (!element) {
		return; // Exit if no element.
	}

	if (!is_filtering && init && !preloaded) {
		return; // Exit if first run and not preloaded.
	}

	element.setAttribute('tabIndex', '-1'); // Set tabIndex.
	element.style.outline = 'none'; // Set element outline.

	// Add slight delay for elements to settle into DOM.
	setTimeout(function () {
		element.focus({ preventScroll: true });
	}, 50);
}

import { almFadeIn, almFadeOut } from './fade';
import { clearTOC } from './tableofcontents';

/**
 * Filter an Ajax Load More instance.
 *
 * @param {string} transition Transition type.
 * @param {number} speed      Transition speed.
 * @param {Object} data       Data object.
 * @param {string} type       Type of filter.
 * @since 2.6.1
 */
export default function almFilter(transition, speed = 200, data, type = 'filter') {
	if (data.target) {
		// Target has been specified.
		const alm = document.querySelectorAll('.ajax-load-more-wrap[data-id="' + data.target.toLowerCase() + '"]');
		if (alm) {
			alm.forEach(function (element) {
				almFilterTransition(transition, speed, data, type, element);
			});
		}
	} else {
		// Target not specified.
		const alm = document.querySelectorAll('.ajax-load-more-wrap');
		if (alm) {
			alm.forEach(function (element) {
				almFilterTransition(transition, speed, data, type, element);
			});
		}
	}

	clearTOC(); // Clear table of contents if required
}

/**
 * Transition Ajax Load More
 *
 * @param {string}  transition Transition type.
 * @param {number}  speed      Transition speed.
 * @param {Object}  data       Data object.
 * @param {string}  type       Type of filter.
 * @param {Element} element    Target element.
 * @since 2.13.1
 */
function almFilterTransition(transition, speed, data, type, element) {
	if (transition === 'fade' || transition === 'masonry') {
		// Fade, Masonry transition

		switch (type) {
			case 'filter':
				element.classList.add('alm-is-filtering');
				almFadeOut(element, speed);
				break;
		}

		// Move to next function
		setTimeout(function () {
			almCompleteFilterTransition(speed, data, type, element);
		}, speed);
	} else {
		// No transition
		element.classList.add('alm-is-filtering');
		almCompleteFilterTransition(speed, data, type, element);
	}
}

/**
 * Complete the filter transition.
 *
 * @param {number}  speed   Transition speed.
 * @param {Object}  data    Data object.
 * @param {string}  type    Type of filter.
 * @param {Element} element Target element.
 * @since 3.3
 */
function almCompleteFilterTransition(speed, data, type, element) {
	const btnWrap = element.querySelector('.alm-btn-wrap'); // Get `.alm-btn-wrap` element
	const listing = element.querySelectorAll('.alm-listing'); // Get `.alm-listing` element

	if (!listing || !btnWrap) {
		// Exit if elements doesn't exist.
		return false;
	}

	// Loop over all .alm-listing divs and clear HTML.
	[...listing].forEach(function (element) {
		// Is this a paging instance.
		const paging = element.querySelector('.alm-paging-content');
		if (paging) {
			paging.innerHTML = '';
		} else {
			element.innerHTML = '';
		}
	});

	// Get Load More button
	const button = btnWrap.querySelector('.alm-load-more-btn');
	if (button) {
		button.classList.remove('done'); // Reset Button
	}

	// Clear paging navigation
	const paging = btnWrap.querySelector('.alm-paging');
	if (paging) {
		paging.style.opacity = 0;
	}

	// Reset Preloaded Amount
	data.preloadedAmount = 0;

	// Dispatch Filters
	almSetFilters(speed, data, type, element);
}

/**
 * Set filter parameters on .alm-listing element.
 *
 * @param {number}  speed   Transition speed.
 * @param {Object}  data    Data object.
 * @param {string}  type    Type of filter.
 * @param {Element} element Target element.
 * @since 2.6.1
 */
function almSetFilters(speed, data, type, element) {
	// Get `alm-listing` container.
	const listing = element.querySelector('.alm-listing') || element.querySelector('.alm-comments');
	if (!listing) {
		return false;
	}

	switch (type) {
		case 'filter':
			// Update data attributes
			for (let [key, value] of Object.entries(data)) {
				// Convert camelCase data atts back to dashes (-).
				key = key
					.replace(/\W+/g, '-')
					.replace(/([a-z\d])([A-Z])/g, '$1-$2')
					.toLowerCase();
				listing.setAttribute('data-' + key, value);
			}
			// Fade ALM back (Filters only)
			almFadeIn(element, speed);
			break;
	}

	// Re-initiate Ajax Load More.
	let target = '';
	if (data.target) {
		// Target has been specified
		target = document.querySelector('.ajax-load-more-wrap[data-id="' + data.target + '"]');
		if (target) {
			window.almInit(target);
		}
	} else {
		// Target not specified
		target = document.querySelector('.ajax-load-more-wrap');
		if (target) {
			window.almInit(target);
		}
	}

	switch (type) {
		case 'filter':
			// Filters Complete (not the add-on)
			if (typeof almFilterComplete === 'function') {
				// Standard Filtering
				almFilterComplete();
			}
			break;
	}
}

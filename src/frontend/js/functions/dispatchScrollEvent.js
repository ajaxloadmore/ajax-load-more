/**
 * Dispatch a window scroll event.
 *
 * @param {boolean} delay Should this be delayed.
 * @since 5.5
 */
export default function dispatchScrollEvent(delay = true) {
	if (typeof Event === 'function') {
		setTimeout(
			function () {
				window.dispatchEvent(new CustomEvent('scroll'));
			},
			delay ? 150 : 1,
		);
	}
}

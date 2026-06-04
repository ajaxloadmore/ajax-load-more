/**
 * Display Ajax Load More debug results.
 *
 * @see https://ajaxloadmore.com/docs/filter-hooks/#alm_debug
 * @param {Object} alm ALM object.
 * @since 5.1.6
 */
export default function almDebug(alm) {
	if (alm && alm.debug) {
		const obj = {
			query: alm.debug,
			localize: alm.localize,
		};
		console.log('ALM Debug:', obj); // eslint-disable-line no-console
	}
}

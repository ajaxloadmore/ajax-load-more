/**
 * Create add-on params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
export function ctaCreateParams(alm) {
	const { listing } = alm;
	alm.addons.cta = listing?.dataset?.cta === 'true';
	if (alm.addons.cta) {
		alm.addons.cta_position = listing.dataset.ctaPosition;
		if (listing.dataset.ctaTemplate) {
			alm.addons.cta_template = listing.dataset.ctaTemplate;
		}
		alm.addons.cta_repeater = listing.dataset.ctaRepeater;
		alm.addons.cta_theme_repeater = listing.dataset.ctaThemeRepeater;
	}
	return alm;
}

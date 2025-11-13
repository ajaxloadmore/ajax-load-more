/**
 * Create params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
export function termsParams(alm) {
	const { listing } = alm;
	alm.extensions.term_query = listing.dataset.termQuery === 'true';

	if (alm.extensions.term_query) {
		alm.extensions.term_query_taxonomy = listing.dataset.termQueryTaxonomy;
		alm.extensions.term_query_hide_empty = listing.dataset.termQueryHideEmpty;
		alm.extensions.term_query_number = listing.dataset.termQueryNumber;
	}

	return alm;
}

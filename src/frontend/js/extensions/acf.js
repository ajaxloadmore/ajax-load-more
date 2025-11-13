/**
 * Create params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
export function acfParams(alm) {
	const { listing } = alm;
	alm.extensions.acf = listing.dataset.acf === 'true';

	if (alm.extensions.acf) {
		alm.extensions.acf_field_type = listing.dataset.acfFieldType;
		alm.extensions.acf_field_name = listing.dataset.acfFieldName;
		alm.extensions.acf_parent_field_name = listing.dataset.acfParentFieldName;
		alm.extensions.acf_row_index = listing.dataset.acfRowIndex;
		alm.extensions.acf_post_id = listing.dataset.acfPostId;

		// if field type, name or post ID is empty.
		if (alm.extensions.acf_field_type === undefined || alm.extensions.acf_field_name === undefined || alm.extensions.acf_post_id === undefined) {
			alm.extensions.acf = false;
		}
	}

	return alm;
}

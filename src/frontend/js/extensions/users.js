/**
 * Create params for ALM.
 *
 * @param {Object} alm The alm object.
 * @return {Object}    The modified object.
 */
export function usersParams(alm) {
	const { listing } = alm;
	alm.extensions.users = listing.dataset.users === 'true';

	if (alm.extensions.users) {
		// Override paging params for users
		alm.orginal_posts_per_page = parseInt(listing.dataset.usersPerPage);
		alm.posts_per_page = parseInt(listing.dataset.usersPerPage);
	}

	return alm;
}

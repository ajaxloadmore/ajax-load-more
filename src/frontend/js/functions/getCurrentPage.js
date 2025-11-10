/**
 * Get the actual page number for the current request.
 * This is because ALM may use zero-based or one-based indexing depending on context.
 * e.g. Preloaded, paging, seo_start_page, filters_startpage etc.
 *
 * @param {Object} alm  The ALM object.
 * @param {Object} data The query data object for sending to Ajax Load More.
 * @return {string}     The cache ID.
 */
export default function getCurrentPage(alm, data) {
	const { addons } = alm;

	let currentPage = data.page + 1; // Convert zero-based page to one-based page.

	// Paging add-on.
	if (addons.paging) {
		return currentPage;
	}

	// Preloaded add-on.
	if (addons.preloaded) {
		if (data.seo_start_page > 1 || data.filters_startpage > 1) {
			return currentPage; // Return current page as-is when SEO or Filters add-on is active.
		}

		return currentPage + 1; // Add another page for preloaded initial page.
	}

	if (alm.init) {
		// SEO add-on (First run only).
		if (data.seo_start_page > 1) {
			currentPage = `1-${data.seo_start_page}`; // Adjust page number based on seo_start_page.
		}
		// Filters (First run only).
		if (data.filters_startpage > 1) {
			currentPage = `1-${data.filters_startpage}`; // Adjust page number based on filters_startpage.
		}
	}

	return currentPage;
}

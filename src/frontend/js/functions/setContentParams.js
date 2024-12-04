/**
 * Set accessibility attributes on the containers.
 *
 * @param {Element} container  The container element.
 * @param {Element} almListing The Ajax Load More container.
 */
export function setContentContainersParams(container, almListing) {
	container.setAttribute('aria-live', 'polite');
	container.setAttribute('aria-atomic', 'true');
	almListing.removeAttribute('aria-live');
	almListing.removeAttribute('aria-atomic');
}

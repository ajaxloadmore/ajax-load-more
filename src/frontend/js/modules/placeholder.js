import timeout from '../functions/timeout';
import { almFadeIn, almFadeOut } from './fade';

/**
 * Show placeholder div.
 *
 * @param {string} type The direction.
 * @param {Object} alm  The ALM object.
 */
export default async function placeholder(type = 'show', alm) {
	const { placeholder, addons, rel } = alm;
	if (!placeholder || addons.paging || rel === 'prev') {
		return false;
	}

	switch (type) {
		case 'hide':
			await almFadeOut(placeholder, 175);
			await timeout(75); // Add short delay for effect.
			placeholder.style.display = 'none';

			break;
		default:
			placeholder.style.display = 'block';
			almFadeIn(placeholder, 175);

			break;
	}
}

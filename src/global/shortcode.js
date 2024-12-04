/**
 * Convert a shortcode to object.
 *
 * @param {string} shortcode The shortcode to parse.
 * @return {Object}          The shortcode attributes.
 */
export function parseShortcodeToObject(shortcode) {
	if (!shortcode) {
		return {};
	}
	const attributes = {};

	// Get all shortcode params between the [...] brackets.
	const params = shortcode.match(/[\w-]+=".*?"/g);
	if (params) {
		params.forEach(function (param) {
			param = param.match(/([\w-]+)="(.*?)"/);
			attributes[param[1]] = param[2];
		});
	}
	return attributes;
}

/**
 * Convert object to shortcode.
 *
 * @param {string} shortcode  The shortcode name.
 * @param {Object} attributes The attributes to convert to a shortcode.
 * @return {string}           The shortcode.
 */
export function parseObjectToShortcode(shortcode = 'ajax_load_more', attributes) {
	if (!attributes) {
		return `[${shortcode}]`;
	}

	let data = '';
	for (const key in attributes) {
		if (attributes.hasOwnProperty(key)) {
			data += `${key}="${attributes[key]}" `;
		}
	}
	return `[${shortcode} ${data.trim()}]`;
}

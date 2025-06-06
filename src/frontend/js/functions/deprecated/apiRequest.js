/**
 * Function to make an API GET request with URL parameters
 *
 * @param {string} url    The base URL for the API request.
 * @param {Object} params Object containing key-value pairs to be converted into URL parameters.
 * @return {Promise<object>} A promise that resolves to the JSON response from the API.
 */
export const apiRequest = async (url = '', params = {}) => {
	const api_url = params ? url + '?' + new URLSearchParams(params).toString() : url;
	try {
		const response = await fetch(api_url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Something went wrong';
		throw new Error(message);
	}
};

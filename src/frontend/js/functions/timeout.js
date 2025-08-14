/**
 * Wait for a specified amount of time.
 *
 * @param {number} ms The number of milliseconds to wait.
 * @return {Promise} A promise that resolves after the specified time.
 */
export default function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

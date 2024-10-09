/**
 * Fetches JSON data from a given URL.
 *
 * @param {string} url
 *   The URL to fetch from.
 *
 * @returns {Promise<Object>}
 *   Resolves with the parsed JSON data from the response.
 *
 * @throws {Error}
 *   If the URL is invalid or the request failed.
 */
async function fetchData(url) {
  if (typeof url !== "string" || !url.trim().length) {
    return Promise.reject(new Error("Invalid URL"));
  }

  const response = await fetch(url);

  if (!response.ok) {
    return Promise.reject(new Error(`HTTP error! status: ${response.status}`));
  }

  return response.json();
}

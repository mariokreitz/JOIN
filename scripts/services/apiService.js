/**
 * The URL of the Firebase Realtime Database.
 * @type {string}
 * @const
 */
const API_URL = firebaseConfig.apiKey;

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

/**
 * Patches data in the Firebase Realtime Database at the given path with the
 * given contact id.
 *
 * @param {string} url
 *   The URL of the Firebase Realtime Database.
 *
 * @param {string} path
 *   The path in the Realtime Database to patch.
 *
 * @param {Object} data
 *   The data to patch into the Realtime Database.
 *
 * @param {number} contactId
 *   The id of the contact to patch.
 *
 * @returns {Promise<Object|undefined>}
 *   Resolves with the response from the server if the request was successful.
 *   Rejects with an error if the request failed or if the contact id was not
 *   found.
 *
 * @throws {Error}
 *   If the contact id was not found in the Realtime Database.
 */
async function patchDataInFirebase(url, path, data, contactId) {
  if (contactId === -1) return Promise.reject(new Error(`No contact with id ${contactId} found in Firebase.`));

  const response = await fetch(`${url}/${path}/${contactId}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) return response;

  return Promise.reject(new Error(`HTTP error! status: ${response.status}`));
}

async function postData() {
  console.log("hallo from postData");
}

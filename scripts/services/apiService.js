/**
 * The URL of the Firebase Realtime Database.
 * @type {string}
 * @const
 */
const API_URL = firebaseConfig.apiKey;

/**
 * Fetches data from the given URL and returns the response as JSON.
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
 * Finds the index of the contact with the given name in the contacts array.
 *
 * @param {string} contactName
 *   The name of the contact to find.
 *
 * @returns {Promise<number>}
 *   The index of the contact in the contacts array, or undefined if not found.
 *
 * @throws {Error}
 *   If the URL is invalid or the request failed.
 */
async function getContactIndexByName(contactName) {
  const contacts = await fetchData(`${API_URL}/contacts.json`);
  if (!contacts) return;

  return contacts?.findIndex((contact) => contact?.name === contactName);
}
/**
 * Fetches JSON data from the given URL in the Firebase Realtime Database.
 *
 * @param {string} url
 *   The URL of the Firebase Realtime Database.
 *
 * @returns {Promise<Object>}
 *   Resolves with the parsed JSON data from the response.
 *
 * @throws {Error}
 *   If the URL is invalid or the request failed.
 */
async function getDataFromFirebase(url) {
  data = await fetchData(url + ".json");
  return data.contacts.filter((el) => el != null);
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
  const fullName = document.getElementById("contact-name").value;
  const email = document.getElementById("contact-email").value;
  const phone = document.getElementById("contact-phone").value;

  const contacts = (await fetchData(`${API_URL}/contacts.json`)) || {};

  const existingIds = Object.keys(contacts);

  let newId = 0;

  if (existingIds.length > 0) {
    for (let i = 0; i < existingIds.length; i++) {
      const currentId = parseInt(existingIds[i]);
      if (currentId >= newId) {
        newId = currentId + 1;
      }
    }
  }

  const newContact = {
    name: fullName,
    email: email,
    phone: phone,
  };

  const response = await fetch(`${API_URL}/contacts/${newId}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newContact),
  });
}

async function deleteDataInFirebase(apiUrl, endpoint, contactIndex) {
  const response = await fetch(`${apiUrl}/${endpoint}/${contactIndex}.json`, {
    method: "DELETE",
  });

  if (response.ok) {
    return "Contact deleted successfully.";
  } else {
    return "Failed to delete contact.";
  }
}

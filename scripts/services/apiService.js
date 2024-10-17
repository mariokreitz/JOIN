/**
 * The array of contacts.
 * @type {Array<Object>}
 */
let contacts;

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
 * Finds the latest created contact in the contacts array.
 *
 * @returns {Promise<Object>}
 *   The latest created contact object, or undefined if not found.
 *
 * @throws {Error}
 *   If the URL is invalid or the request failed.
 */
async function getLatestCreatedContact() {
  const contacts = await getDataFromFirebase(API_URL);
  if (!contacts) return;

  return contacts.reduce((latest, current) => {
    if (!latest || current.createdAt > latest.createdAt) {
      return current;
    }
    return latest;
  }, undefined);
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

/**
 * Checks if a contact with the same email or phone number already exists.
 *
 * @param {string} email
 *   The email of the contact to check.
 *
 * @param {string} phone
 *   The phone number of the contact to check.
 *
 * @param {Object.<string, Object>} contacts
 *   The contacts to check against.
 *
 * @returns {Promise<boolean>}
 *   Resolves with true if a contact with the same email or phone number
 *   already exists, false otherwise.
 */
async function checkIfDuplicate(email, phone, contacts) {
  const duplicateContact = Object.values(contacts).find(
    (contact) => contact.email === email || contact.phone === phone
  );
  if (duplicateContact) {
    alert("Kontakt mit der gleichen E-Mail oder Telefonnummer existiert bereits.");
    return true;
  }
  return false;
}

/**
 * Finds the last ID in the contacts object and returns the next one.
 *
 * @param {Object.<string, Object>} contacts
 *   The contacts object to find the last ID in.
 *
 * @returns {number}
 *   The next contact ID.
 */
function checkLastID(contacts) {
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
  return newId;
}

/**
 * Posts the contact data in the contact form to the Firebase Realtime
 * Database.
 *
 * @returns {Promise<Object|undefined>}
 *   Resolves with the response from the server if the request was successful.
 *   Rejects with an error if the request failed or if a contact with the same
 *   email or phone number already exists.
 *
 * @throws {Error}
 *   If the request failed or if a contact with the same email or phone number
 *   already exists.
 */
async function postData() {
  const fullName = document.getElementById("contact-name").value;
  const email = document.getElementById("contact-email").value;
  const phone = document.getElementById("contact-phone").value;

  const contacts = await getDataFromFirebase(API_URL);

  if (await checkIfDuplicate(email, phone, contacts)) return;

  const newId = checkLastID(contacts);

  const profileColor = profileColors[Math.floor(Math.random() * profileColors.length)];

  const newContact = {
    color: profileColor,
    contactSelect: false,
    createdAt: Date.now(),
    email: email,
    name: fullName,
    phone: phone,
  };

  const response = await fetch(`${API_URL}/contacts/${newId}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newContact),
  });

  if (response.ok) return response;

  return Promise.reject(new Error(`HTTP error! status: ${response.status}`));
}

/**
 * Deletes the contact with the given index from the given endpoint in the
 * Firebase Realtime Database.
 *
 * @param {string} apiUrl
 *   The URL of the Firebase Realtime Database.
 *
 * @param {string} endpoint
 *   The endpoint in the Realtime Database to delete the contact from.
 *
 * @param {number} contactIndex
 *   The index of the contact to delete.
 *
 * @returns {Promise<Object>}
 *   Resolves with the response from the server if the request was successful.
 *   Rejects with an error if the request failed.
 *
 * @throws {Error}
 *   If the request failed or if the contact index was not found.
 */
async function deleteDataInFirebase(apiUrl, endpoint, contactIndex) {
  const response = await fetch(`${apiUrl}/${endpoint}/${contactIndex}.json`, {
    method: "DELETE",
  });

  if (response.ok) return response;

  return Promise.reject(new Error(`HTTP error! status: ${response.status}`));
}

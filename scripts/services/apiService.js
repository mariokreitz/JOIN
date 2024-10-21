/**
 * The array of contacts.
 * @type {Array<Object>}
 */
let globalContacts;

/**
 * The array of todos.
 * @type {Array<Object>}
 */
let globalTodos;

/**
 * The URL of the Firebase Realtime Database.
 * @type {string}
 * @const
 */
const API_URL = firebaseConfig.apiKey;

/**
 * Fetches data from the given URL and returns it as JSON.
 *
 * @param {string} url - The URL to fetch from.
 * @returns {Promise<Object>} A promise that resolves with the data from the URL as JSON.
 * @throws {Error} If the URL is invalid or the response from the server was not OK.
 */
async function fetchData(url) {
  if (typeof url !== "string" || !url.trim().length) return Promise.reject(new Error("Invalid URL"));

  const response = await fetch(url);

  if (!response.ok) return Promise.reject(new Error(`HTTP error! status: ${response.status}`));

  return response.json();
}

/**
 * Fetches the contacts from the given user from the Firebase Realtime Database.
 *
 * @param {string} user - The user whose contacts are to be retrieved.
 * @returns {Promise<void>} - A promise that resolves when the data has been fetched and the contacts array has been set.
 */
async function getContactsFromData(user) {
  const data = await getDataFromFirebase();
  globalContacts = objectToArray(data[user].contacts);
}

/**
 * Fetches the todos from the given user from the Firebase Realtime Database.
 *
 * @param {string} user - The user whose todos are to be retrieved.
 * @returns {Promise<void>} - A promise that resolves when the data has been fetched and the todos array has been set.
 */
async function getTodosFromData(user) {
  const data = await getDataFromFirebase();
  globalTodos = objectToArray(data[user].todos);
}

//TODO: refactore
async function getContactIndexByName(contactName, path, initials) {
  const contacts = await fetchData(`${API_URL}/${path}.json`);

  if (!contacts) return;
  return findKeyByName(contacts, contactName).replace(`${initials}`, "");
}

/**
 * Retrieves the latest created contact for a specified user from Firebase.
 *
 * @param {string} user - The user whose contacts are to be retrieved.
 * @returns {Promise<Object|undefined>} A promise that resolves with the latest created contact
 * object or undefined if no contacts are found.
 */
async function getLatestCreatedContact(user) {
  const data = await getDataFromFirebase();
  if (!data) return;

  const contacts = objectToArray(data[user].contacts);

  return contacts.reduce((latestContact, currentContact) => {
    if (!latestContact || currentContact.createdAt > latestContact.createdAt) {
      return currentContact;
    }
    return latestContact;
  }, undefined);
}

/**
 * Retrieves the entire data object from the Firebase Realtime Database.
 *
 * @returns {Promise<Object|undefined>} A promise that resolves with the data
 * object from the Firebase Realtime Database, or undefined if no data is found.
 */
async function getDataFromFirebase() {
  const data = await fetchData(API_URL + ".json");
  if (!data) return;

  return data;
}

//TODO: refactore
async function patchDataInFirebase(path, initials, contactId, data) {
  if (contactId === -1) return Promise.reject(new Error(`No contact with id ${contactId} found in Firebase.`));
  const response = await fetch(`${API_URL}/${path}/${initials}${contactId}.json`, {
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
 * Checks if a contact with the same email or phone number already exists in the contacts list.
 *
 * @param {string} email - The email to check for duplicates.
 * @param {string} phone - The phone number to check for duplicates.
 * @param {Array<Object>} contacts - The array of contact objects to check against.
 * @returns {Promise<boolean>} A promise that resolves to true if a duplicate contact is found, otherwise false.
 */
async function checkIfDuplicate(email, phone, contacts) {
  const duplicateContact = contacts.find((contact) => contact.email === email || contact.phone === phone);
  if (duplicateContact) {
    return true;
  }
  return false;
}

/**
 * Puts new contact data into the Firebase Realtime Database.
 *
 * @param {Object} newContact - The new contact data to be added.
 * @param {string} user - The user to add the contact for.
 * @returns {Promise<Response|Error>} A promise that resolves with the response from the Firebase Database if successful, or rejects with an error if there is a HTTP error.
 */
async function putDataInFirebase(newContact, user) {
  const data = await getDataFromFirebase();
  if (!data) return;
  const contacts = objectToArray(data[user].contacts);
  if (await checkIfDuplicate(newContact.email, newContact.phone, contacts)) {
    return { status: 400, ok: true, statusText: "Duplicate contact found." };
  }
  const initials = getInitialsFromContact(newContact);
  const response = await fetch(`${API_URL}/${user}/contacts/${initials}${newContact.createdAt}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newContact),
  });
  if (response.ok) return response;
  return response;
}

/**
 * Deletes the data at the specified endpoint in the Firebase Realtime Database.
 *
 * @param {string} apiUrl - The URL of the Firebase Realtime Database.
 * @param {string} endpoint - The path to the data to be deleted in the Firebase
 *   Realtime Database.
 * @returns {Promise<Response>} A promise that resolves with the response from the
 *   server or rejects with an error if the response from the server was not OK.
 * @throws {Error} If the URL is invalid or the response from the server was not OK.
 */
async function deleteDataInFirebase(apiUrl, endpoint) {
  const response = await fetch(`${apiUrl}/${endpoint}.json`, {
    method: "DELETE",
  });

  if (response.ok) return response;

  return response;
}

/**
 * Patches the todos object in the Firebase Realtime Database with the given data.
 *
 * @param {Object} todosObject - The data to patch the todos object with.
 * @param {string} user - The user whose todos object is to be patched.
 * @returns {Promise<Response>} A promise that resolves with the response from the
 *   server if the patch was successful, or rejects with an error if the response
 *   from the server was not OK.
 * @throws {Error} If the URL is invalid or the response from the server was not OK.
 */
async function updateTodosInFirebase(todosObject, user) {
  const response = await fetch(`${API_URL}/${user}/todos/.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todosObject),
  });
  if (response.ok) return response;
  return response;
}

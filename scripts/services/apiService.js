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

/**
 * Given the 'createdAt' property of a contact and a user, returns the
 * id of the contact in the Firebase Realtime Database.
 *
 * @param {string|number} createdAt - The 'createdAt' property of the contact.
 * @param {string} user - The user whose contacts are to be searched.
 * @returns {Promise<string|undefined>} A promise that resolves with the
 * id of the contact if found, or undefined if not found.
 */
async function getContactIdByCreatedAt(user, createdAt) {
  const contacts = await fetchData(`${API_URL}/${user}/contacts.json`);
  if (!contacts) return;
  return findKeyByCreatedAt(contacts, createdAt);
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

/**
 * Updates the data of a specific contact in the Firebase Realtime Database.
 *
 * @param {string} user - The user whose contact data is being updated.
 * @param {string} contactID - The ID of the contact to be updated.
 * @param {Object} data - The new data to be patched into the contact.
 * @returns {Promise<Response>} A promise that resolves with the response from the patch request.
 */
async function updateContactInDatabase(user, contactID, data) {
  const response = await fetch(`${API_URL}/${user}/contacts/${contactID}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
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
async function createContactInDatabase(user, newContact) {
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
  return response;
}

/**
 * Deletes the contact with the given contactID from the Firebase Realtime Database.
 *
 * @param {string} user - The user whose contact is to be deleted.
 * @param {string} contactID - The ID of the contact to be deleted.
 * @returns {Promise<Response>} A promise that resolves with the response from the Firebase Database if successful, or rejects with an error if there is a HTTP error.
 */
async function deleteContactFromDatabase(user, contactID) {
  const response = await fetch(`${API_URL}/${user}/contacts/${contactID}.json`, {
    method: "DELETE",
  });
  return response;
}

/**
 * Patches the todos object in the Firebase Realtime Database.
 *
 * @param {Object} todosObject - The object containing the todos to be updated.
 * @param {string} user - The user whose todos are to be updated.
 * @returns {Promise<Response|Error>} A promise that resolves with the response from the Firebase Database if successful, or rejects with an error if there is a HTTP error.
 */
async function updateTodosInFirebase(user, todosObject) {
  const response = await fetch(`${API_URL}/${user}/todos/.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todosObject),
  });
  return response;
}

async function deleteTodosInFirebase(user, todoID) {
  const response = await fetch(`${API_URL}/${user}/todos/${todoID}.json`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) return response;
  return response;
}

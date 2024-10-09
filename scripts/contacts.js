const API_URL = firebaseConfig.apiKey;
let contacts;

/**
 * Initializes the app by fetching data and rendering the contacts.
 * @returns {Promise<void>} - A promise that resolves when the data has been fetched and the contacts have been rendered.
 */
async function init() {
  await getData(API_URL);
  await renderContactList();
}

/**
 * Fetches data from the given URL and sets the contacts array to the data in the contacts key.
 * If the data does not have a contacts key, the contacts array is set to an empty array.
 * @param {string} url - The URL to fetch from.
 * @returns {Promise<void>} - A promise that resolves when the data has been fetched and the contacts array has been set.
 */
async function getData(url) {
  const data = await fetchData(url + ".json");
  contacts = data.contacts || [];
}

/**
 * Renders the contacts list in the #contactList element.
 *
 * The list is sorted by the first letter of the contact's name and grouped by letter.
 *
 * @returns {Promise<void>} - A promise that resolves when the contacts list has been rendered.
 */
async function renderContactList() {
  const contactListElement = document.getElementById("contactList");
  if (!contactListElement) return;

  const contactsByLetter = contacts.reduce((categories, contact) => {
    const letter = contact.name.split(" ")[0].charAt(0).toUpperCase();
    if (!categories[letter]) {
      categories[letter] = [];
    }
    categories[letter].push(contact);
    return categories;
  }, {});

  const sortedLetters = Object.keys(contactsByLetter).sort((a, b) => a.localeCompare(b));

  const contactListHtml = sortedLetters
    .map((letter) => {
      const contactsForLetter = contactsByLetter[letter];
      const contactElements = contactsForLetter.map((contact) => {
        const initials = getInitialsFromContact(contact);
        return getContactTemplate(initials, contact.name, contact.email);
      });
      return `
      <h2>${letter}</h2>
      ${contactElements.join("")}
    `;
    })
    .join("");
  contactListElement.innerHTML = contactListHtml;
}

/**
 * Given a contact object, returns the initials of the contact's name.
 * Example: for a contact with name "John Doe", returns "JD".
 * @param {Object} contact - The contact object.
 * @returns {string} The initials of the contact's name.
 */
function getInitialsFromContact({ name }) {
  const [firstName, lastName] = name.split(" ");
  const firstInitial = firstName.charAt(0);
  const lastInitial = lastName.charAt(0);
  return `${firstInitial}${lastInitial}`;
}

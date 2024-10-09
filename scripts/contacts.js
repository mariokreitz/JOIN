const API_URL = firebaseConfig.apiKey;
let contacts;

/**
 * Initializes the app by loading all necessary components and fetching data
 * from the Realtime Database.
 *
 * @returns {Promise<void>}
 */
async function init() {
  loadComponents();
  await getData(API_URL);
  renderContactList();
}

/**
 * Loads all necessary components into the page.
 *
 * Currently, this function only loads the header and navbar components.
 * @returns {void}
 */
function loadComponents() {
  loadHeader();
  loadNavbar();
}

/**
 * Loads the header component into the element with the id "header".
 * If no element with that id exists, this function does nothing.
 * @returns {void}
 */
function loadHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  header.innerHTML = getHeaderTemplate();
}

/**
 * Loads the navbar component into the element with the id "navbar".
 * If no element with that id exists, this function does nothing.
 *
 * @returns {void}
 */
function loadNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  navbar.innerHTML = getNavbarTemplate("contacts");
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
 * Renders the list of contacts into the element with the id "contactList".
 * If no element with that id exists, this function does nothing.
 * @returns {void}
 */
function renderContactList() {
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
        return getContactTemplate(initials, contact.color, contact.name, contact.email);
      });
      return /*html*/ `
        <div class="contact-letter">
          <h3 class="inter-extralight">${letter}</h3>
        </div>
        <div class="contact-horizontal-seperator"></div>
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

window.addEventListener("resize", renderContactList);

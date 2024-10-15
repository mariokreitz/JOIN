/**
 * The array of contacts.
 * @type {Array<Object>}
 */
let contacts;

/**
 * An array of colors that can be used to color user profiles.
 * @type {Array<string>}
 */
const profileColors = [
  "#FF7A00",
  "#FF5EB3",
  "#6E52FF",
  "#9327FF",
  "#00BEE8",
  "#1FC7C1",
  "#8B9467",
  "#FF745E",
  "#FFA35E",
  "#FC71FF",
  "#FFC701",
  "#0038FF",
  "#B22222",
  "#C3FF2B",
  "#FFE62B",
  "#FF4646",
  "#FFBB2B",
  "#FF7A00",
  "#FF5EB3",
  "#6E52FF",
];

/**
 * Initializes the page by loading the necessary components and rendering
 * the contact list.
 *
 * @returns {Promise<void>} A promise that resolves when the page has been
 * initialized.
 */
async function init() {
  loadComponents();
  renderContactsPage();
}

/**
 * Renders the contacts page by fetching data from the given URL and
 * rendering the contact list.
 *
 * @returns {Promise<void>}
 */

async function renderContactsPage() {
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
  contacts = await getDataFromFirebase(url);
}

/**
 * Renders the contact list by mapping the contacts array to an HTML string and
 * setting the innerHTML of the element with the id "contactList" to that string.
 *
 * The contacts array is first grouped by the first letter of the contact name
 * and then sorted by letter. For each letter, an HTML string is created for
 * the contacts under that letter. The HTML string for each contact includes an
 * avatar with the contact's initials and the contact's name and email.
 *
 * @returns {void}
 */
function renderContactList() {
  let index = -1;
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
        index++;
        return getContactTemplate(index, initials, contact.color, contact.name, contact.email);
      });
      return /*html*/ `
        <li class="contact-letter">
          <h3 class="inter-extralight">${letter}</h3>
        </li>
        <li class="contact-horizontal-seperator"></li>
        ${contactElements.join("")}
      `;
    })
    .join("");
  contactListElement.innerHTML = contactListHtml;
}

/**
 * Removes the contact view by setting the innerHTML of the element with the id
 * "contact-view" to an empty string.
 *
 * This function is useful when the contact view needs to be cleared without
 * toggling the contact view. It is equivalent to calling `toggleContactView(-1)`.
 *
 * @returns {void}
 */

function removeContactView() {
  const contactViewElement = document.getElementById("contact-view");
  if (!contactViewElement) return;
  contactViewElement.innerHTML = "";
}

/**
 * Given a contact object, returns the contact's initials as a string. The
 * initials are determined by taking the first character of the first name and
 * the first character of the last name. If either the first or last name is not
 * present, the corresponding initial is an empty string.
 *
 * @param {object} contact - Contact object with a `name` property.
 * @returns {string} The contact's initials as a string.
 */
function getInitialsFromContact({ name: fullName }) {
  const [firstName, lastName] = fullName.split(" ");
  const firstInitial = firstName ? firstName.charAt(0) : "";
  const lastInitial = lastName ? lastName.charAt(0) : "";
  return `${firstInitial}${lastInitial}`;
}
/**
 * Listens for the window resize event and re-renders the contact list when
 * fired.
 *
 * This is necessary because the contact list is rendered with a masonry
 * layout, which needs to be re-laid out when the window is resized.
 *
 * @listens window#resize
 * @returns {void}
 */
window.addEventListener("resize", renderContactList);

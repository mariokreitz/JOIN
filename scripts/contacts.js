/**
 * Initializes the page by loading the necessary components and rendering
 * the contact list.
 *
 * @returns {Promise<void>} A promise that resolves when the page has been
 * initialized.
 */
async function init() {
  loadComponents();
  await getContactsFromData("guest");
  await getTodosFromData("guest");
  renderContactsPage();
}

/**
 * Renders the contacts page by fetching data from the given URL and
 * rendering the contact list.
 *
 * @returns {Promise<void>}
 */

async function renderContactsPage() {
  await getContactsFromData("guest");
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
 * Renders the contact list in the element with the id "contactList".
 *
 * If the element does not exist, does nothing.
 *
 * If the globalContacts array is empty, renders a message prompting the user
 * to add a contact.
 *
 * Otherwise, groups all contacts by the first letter of their name, renders
 * the HTML for the contact list given the grouped contacts, and sets the
 * innerHTML of the element to the rendered HTML.
 *
 * @returns {void}
 */
function renderContactList() {
  const contactListElement = document.getElementById("contactList");

  if (!contactListElement) return;
  if (globalContacts.length === 0) renderNoContactsMessage();

  const contactsByLetter = groupContactsByLetter();
  const contactListHtml = renderContactListHtml(contactsByLetter);
  contactListElement.innerHTML = contactListHtml;
}

/**
 * Given an object where the keys are letters and the values are arrays of
 * contacts whose name starts with the key, returns an HTML string representing
 * the contact list.
 *
 * The contact list is rendered with a masonry layout, which can be
 * customized by modifying the CSS classes used in the returned HTML.
 *
 * @param {Object<string, Array<Object>>} contactsByLetter - An object where the
 *   keys are letters and the values are arrays of contacts whose name starts
 *   with the key.
 * @returns {string} An HTML string representing the contact list.
 */
function renderContactListHtml(contactsByLetter) {
  let contactIndex = -1;
  const sortedLetters = Object.keys(contactsByLetter).sort((a, b) => a.localeCompare(b));
  return sortedLetters
    .map((letter) => {
      const contactsForLetter = contactsByLetter[letter];
      const contactElements = contactsForLetter.map((contact) => {
        const initials = getInitialsFromContact(contact);
        contactIndex++;
        return getContactTemplate(contactIndex, initials, contact.color, contact.name, contact.email);
      });
      return getContactSectionTemplate(letter, contactElements);
    })
    .join("");
}

/**
 * Returns an object where the keys are the first letters of the contacts' names
 * and the values are arrays of contacts whose name starts with the key.
 *
 * @returns {Object<string, Array<Object>>}
 */
function groupContactsByLetter() {
  return globalContacts.reduce((contactsByLetter, contact) => {
    const firstLetter = contact.name.split(" ")[0].charAt(0).toUpperCase();
    if (!contactsByLetter[firstLetter]) {
      contactsByLetter[firstLetter] = [];
    }
    contactsByLetter[firstLetter].push(contact);
    return contactsByLetter;
  }, {});
}

/**
 * If there are no contacts in the globalContacts array, renders a message
 * in the contact list element that prompts the user to add a contact.
 *
 * @returns {void}
 */
function renderNoContactsMessage() {
  const contactListElement = document.getElementById("contactList");

  if (!contactListElement) return;
  contactListElement.innerHTML = /*html*/ `
      <li class="no-contacts">
        <p>Add a contact to start growing your network!</p>
      </li>
    `;
  return;
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
window.addEventListener("orientationchange", renderContactList);

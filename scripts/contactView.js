/**
 * Toggles the contact view based on the id of the contact item. If the contact
 * item is selected, the contact view is rendered with the contact's initials and
 * contact information. If the contact item is deselected, the contact view is
 * cleared.
 *
 * @param {number} contactId - The id of the contact item.
 * @returns {void}
 */
function toggleContactView(contactId) {
  const contactItemElement = document.getElementById(`contact-item-${contactId}`);
  if (!contactItemElement) return;

  const contactViewElement = document.getElementById("contact-view");
  if (!contactViewElement) return;

  const contactName = contactItemElement.querySelector(".contact-name").textContent;
  const contact = contacts.find((c) => c.name === contactName);

  const initials = getInitialsFromContact(contact);
  toggleSelectedContactInList(contact, contactItemElement);
  if (contact.contactSelect) {
    contactViewElement.innerHTML = getContactViewTemplate(initials, contact);
  } else {
    contactViewElement.innerHTML = "";
  }
}

/**
 * Toggles the selected class on the contact item element and updates the
 * contactSelect property of the selected contact. If another contact was
 * previously selected, it will be deselected.
 *
 * @param {Object} selectedContact - The contact object of the selected contact.
 * @param {HTMLElement} contactItemElement - The <li> element representing the contact item.
 */
function toggleSelectedContactInList(selectedContact, contactItemElement) {
  const previouslySelectedElement = document.querySelector(".selected");

  if (contactItemElement.classList.contains("selected")) {
    contactItemElement.classList.remove("selected");
    selectedContact.contactSelect = false;
  } else {
    contactItemElement.classList.add("selected");
    selectedContact.contactSelect = true;
  }
  if (previouslySelectedElement) {
    previouslySelectedElement.classList.remove("selected");
    const previouslySelectedContact = contacts.find(
      (c) => c.name === previouslySelectedElement.querySelector(".contact-name").textContent
    );
    previouslySelectedContact.contactSelect = false;
  }
}

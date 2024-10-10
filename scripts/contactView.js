/**
 * Opens the contact view for the given contact ID by finding the contact item
 * by its ID, extracting the contact name from the contact item, finding the
 * contact object in the contacts array, and setting the innerHTML of the
 * contact view to the contact view template with the contact object.
 * @param {number} contactId - The ID of the contact to open in the contact view.
 * @returns {void}
 */
function openContactView(contactId) {
  const contactItem = document.getElementById(`contact-item-${contactId}`);
  if (!contactItem) return;

  const contactNameElement = contactItem.querySelector(".contact-name");
  const contactName = contactNameElement.textContent;

  const contact = contacts.find((c) => c.name === contactName);

  const contactView = document.getElementById("contact-view");
  contactView.innerHTML = getContactViewTemplate(contact);
}

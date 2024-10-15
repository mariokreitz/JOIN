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
  const contactViewElement = document.getElementById("contact-view");
  if (contactId === -1) {
    deselectContact(contactViewElement);
    return;
  }
  if (!contactItemElement || !contactViewElement) return;
  const contactName = contactItemElement.querySelector(".contact-name").textContent;
  const contact = contacts.find((c) => c.name === contactName);
  const initials = getInitialsFromContact(contact);
  const isAlreadySelected = contact.contactSelect;
  toggleSelectedContactInList(contact, contactItemElement);
  if (isAlreadySelected) {
    applyAnimationToContactView("slide-out", contactViewElement, () => {
      contactViewElement.innerHTML = "";
    });
  } else {
    displayContactView(contactViewElement, initials, contact);
  }
  adjustDisplayForScreenSize(contact);
}

/**
 * Deselects the currently selected contact and clears the contact view.
 *
 * @param {HTMLElement} contactViewElement - The element displaying the contact view.
 */
function deselectContact(contactViewElement) {
  const previouslySelectedElement = document.querySelector(".selected");
  if (previouslySelectedElement) {
    previouslySelectedElement.classList.remove("selected");
    const previouslySelectedContact = contacts.find(
      (c) => c.name === previouslySelectedElement.querySelector(".contact-name").textContent
    );
    if (previouslySelectedContact) {
      previouslySelectedContact.contactSelect = false;
    }
  }

  contactViewElement.innerHTML = "";
  const contactListWrapper = document.querySelector(".contact-list-wrapper");
  const contactMainContainer = document.querySelector(".contact-main-container");
  contactListWrapper.style.display = "block";
  contactMainContainer.style.display = "none";
}

/**
 * Displays the contact view with the selected contact's information.
 *
 * @param {HTMLElement} contactViewElement - The element displaying the contact view.
 * @param {string} initials - The initials of the contact.
 * @param {Object} contact - The contact object containing contact information.
 */
function displayContactView(contactViewElement, initials, contact) {
  if (contactViewElement.innerHTML) {
    applyAnimationToContactView("slide-out", contactViewElement, () => {
      contactViewElement.innerHTML = getContactViewTemplate(initials, contact);
      applyAnimationToContactView("slide-in", contactViewElement);
    });
  } else {
    contactViewElement.innerHTML = getContactViewTemplate(initials, contact);
    applyAnimationToContactView("slide-in", contactViewElement);
  }
}

/**
 * Adjusts the display of the contact list and main container based on the selected contact
 * and screen size.
 *
 * @param {Object} contact - The currently selected contact.
 */
function adjustDisplayForScreenSize(contact) {
  if (window.innerWidth <= 1320) {
    const contactListWrapper = document.querySelector(".contact-list-wrapper");
    const contactMainContainer = document.querySelector(".contact-main-container");
    contactListWrapper.style.display = contact.contactSelect ? "none" : "block";
    contactMainContainer.style.display = contact.contactSelect ? "flex" : "none";
  }
}

/**
 * Toggles the selected class on the contact item element and updates the
 * contactSelect property of the selected contact.
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
  if (previouslySelectedElement && previouslySelectedElement !== contactItemElement) {
    previouslySelectedElement.classList.remove("selected");
    const previouslySelectedContact = contacts.find(
      (c) => c.name === previouslySelectedElement.querySelector(".contact-name").textContent
    );
    if (previouslySelectedContact) {
      previouslySelectedContact.contactSelect = false;
    }
  }
}

/**
 * Applies an animation to the contact view element.
 *
 * @param {string} animationType - The type of animation to apply.
 * @param {HTMLElement} element - The element to which the animation will be applied.
 * @param {Function} callback - A callback function to execute after the animation ends.
 */
function applyAnimationToContactView(animationType, element, callback) {
  const body = document.body;
  body.style.overflow = "hidden";
  element.style.animation = `${animationType} 0.3s ease-out forwards`;
  if (callback) {
    element.addEventListener(
      "animationend",
      () => {
        body.style.overflow = "";
        callback();
      },
      { once: true }
    );
  }
}

function toggleEditMenu() {
  var menu = document.getElementById("contact-edit-menu");
  if (menu.classList.contains("show")) {
    menu.classList.remove("show");
    document.removeEventListener("click", closeEditMenu);
  } else {
    menu.classList.add("show");
    document.addEventListener("click", closeEditMenu);
  }
}

function closeEditMenu(event) {
  var menu = document.getElementById("contact-edit-menu");
  var button = document.getElementById("menuButton");
  if (menu && button) {
    if (!menu.contains(event.target) && !button.contains(event.target)) {
      menu.classList.remove("show");
      document.removeEventListener("click", closeEditMenu);
    }
  }
}

/**
 * Given an array of contacts, an array of assigned members, and a filter string, returns an HTML string
 * representing the contact list.
 *
 * @param {Array<Object>} contacts - An array of contact objects.
 * @param {Array<string>} assignedMembers - An array of strings representing the names of assigned members.
 * @param {string} filter - A string to filter the contacts by.
 * @returns {string} An HTML string representing the contact list.
 */
function generateContactListHtml(contacts, assignedMembers = [], filter = "") {
  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(filter.toLowerCase()));

  if (filteredContacts.length === 0) return noContactsTemplate();

  return filteredContacts
    .map((contact) => {
      const initials = getInitialsFromContact(contact);
      const originalIndex = contacts.indexOf(contact);

      const isSelected = objectToArray(assignedMembers).some(
        (member) => member.name.toLowerCase() === contact.name.toLowerCase()
      );

      return contactListItemTemplate(contact, originalIndex, initials, isSelected);
    })
    .join("");
}

/**
 * Renders the contact dropdown list by generating the HTML for the list and setting the
 * innerHTML of the dropdown options element to the generated HTML.
 *
 * @param {Array<string>} [assignedMembers] - An array of strings representing the names of assigned members.
 *   Defaults to an empty array.
 * @param {string} [filterValue] - A string to filter the contacts by. Defaults to an empty string.
 * @returns {void}
 */
function renderContactDropdown(assignedMembers = [], filterValue) {
  const dropdownOptionsElement = document.getElementById("contact-dropdown-options");

  if (dropdownOptionsElement) {
    const contactListHtml = generateContactListHtml(globalContacts, assignedMembers, filterValue);
    dropdownOptionsElement.innerHTML = contactListHtml;
  }
}

/**
 * Toggles the contact dropdown by toggling the "show" class on the dropdown options element.
 *
 * Listens for a click event on the document to close the dropdown when clicked outside of the dropdown.
 *
 * If the event target is the dropdown icon or icon container, toggles the "show" class and the "rotated" class on the dropdown icon.
 * If the event target is not the dropdown icon or icon container and the dropdown is not visible, shows the dropdown and adds the event listener.
 * If the event target is not the dropdown icon or icon container and the dropdown is visible, removes the event listener and hides the dropdown.
 *
 * @param {Event} event - The event object from the click event.
 * @returns {void}
 */
function toggleContactDropdown(event) {
  event.stopPropagation();
  const dropdownElement = document.getElementById("contact-dropdown-options");
  const iconElement = document.getElementById("dropdown-icon");

  if (event.target.id === "dropdown-icon-container" || event.target.id === "dropdown-icon") {
    dropdownElement.classList.toggle("show");
    iconElement.classList.toggle("rotated");

    if (dropdownElement.classList.contains("show")) {
      document.addEventListener("click", outsideClickListenerWrapper);
    } else {
      document.removeEventListener("click", outsideClickListenerWrapper);
    }
  } else {
    if (dropdownElement && !dropdownElement.classList.contains("show")) {
      dropdownElement.classList.add("show");
      iconElement.classList.add("rotated");
      document.addEventListener("click", outsideClickListenerWrapper);
    }
  }
}

/**
 * Filters the contact dropdown options based on the search input value and
 * re-renders the dropdown with the filtered options.
 *
 * @returns {void}
 */
function filterContactOptions() {
  const searchInput = document.getElementById("search");
  const filterValue = searchInput.value;
  const assignedMembers = getAssignedMembersNames();
  renderContactDropdown(assignedMembers, filterValue);
}

/**
 * Toggles the selection of a contact dropdown option by changing the
 * checked state of the checkbox and the selected class of the option.
 *
 * @param {HTMLElement} option - The <li> element of the contact dropdown option.
 *
 * @returns {void}
 */
function toggleOptionSelection(option) {
  const checkboxElement = option.querySelector(".checkbox");
  const initialsText = option.querySelector(".badge").innerText.trim();
  const contactId = option.dataset.id;

  const isChecked = (checkboxElement.checked = !checkboxElement.checked);
  option.classList.toggle("selected", isChecked);

  if (isChecked) addBadge(contactId, initialsText, option.querySelector(".badge").style.backgroundColor);
  else removeBadge(contactId);
}

/**
 * Adds a badge to the selected-badges container for the given contact ID and
 * initials. The badge is colored with the given color.
 *
 * @param {string} contactId - The ID of the contact to add a badge for.
 * @param {string} contactInitials - The initials of the contact to add a badge for.
 * @param {string} badgeColor - The color of the badge to add.
 */
function addBadge(contactId, contactInitials, badgeColor) {
  if (!selectedOptions.includes(contactId)) {
    selectedOptions.push(contactId);

    const badgeContainer = document.getElementById("selected-badges");
    const badgeElement = document.createElement("div");

    badgeElement.classList.add("selected-badge");
    badgeElement.setAttribute("data-id", contactId);
    badgeElement.style.backgroundColor = badgeColor;
    badgeElement.innerHTML = `<span>${contactInitials}</span>`;
    badgeContainer.appendChild(badgeElement);
  }
}

/**
 * Removes the badge for the given contact ID from the selected-badges
 * container and removes the contact ID from the selectedOptions array.
 *
 * @param {string} contactId - The ID of the contact to remove a badge for.
 *
 * @returns {void}
 */
function removeBadge(contactId) {
  const index = selectedOptions.indexOf(contactId);
  if (index >= 0) selectedOptions.splice(index, 1);

  const badgeContainer = document.getElementById("selected-badges");
  const badgeElement = badgeContainer.querySelector(`.selected-badge[data-id="${contactId}"]`);

  if (badgeElement) badgeElement.remove();
}

/**
 * Initializes the badges for the contact dropdown options by iterating through
 * each option. If the option is checked, it adds a badge to the selected-badges
 * container with the contact's initials and color, and marks the option as selected.
 *
 * This function ensures that the UI correctly reflects the current selection
 * state of the contacts when the dropdown is opened.
 *
 * @returns {void}
 */
function initializeBadges() {
  const contactOptions = document.querySelectorAll("#contact-dropdown-options li");

  contactOptions.forEach((contactOption) => {
    const checkboxElement = contactOption.querySelector(".checkbox");
    const contactInitials = contactOption.querySelector(".badge").innerText.trim();
    const contactId = contactOption.dataset.id;

    contactOption.classList.remove("selected");

    if (checkboxElement.checked) {
      const badgeColor = contactOption.querySelector(".badge").style.backgroundColor;
      addBadge(contactId, contactInitials, badgeColor);
      contactOption.classList.add("selected");
    }
  });
}

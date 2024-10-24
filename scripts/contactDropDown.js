function generateContactListHtml(contacts, assignedMembers = [], filter = "") {
  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(filter.toLowerCase()));

  if (filteredContacts.length === 0) {
    return noContactsTemplate();
  }

  return filteredContacts
    .map((contact) => {
      const initials = getInitialsFromContact(contact);
      const originalIndex = contacts.indexOf(contact);
      const isSelected = assignedMembers.some((member) => member.toLowerCase() === contact.name.toLowerCase());

      return contactListItemTemplate(contact, originalIndex, initials, isSelected);
    })
    .join("");
}

function renderContactDropdown(assignedMembers = []) {
  const dropdownOptions = document.getElementById("contact-dropdown-options");
  const input = document.getElementById("search");
  const filter = input.value;

  if (dropdownOptions) {
    const contactListHtml = generateContactListHtml(globalContacts, assignedMembers, filter);
    dropdownOptions.innerHTML = contactListHtml;
  }
}

function toggleContactListDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById("contact-dropdown-options");
  const icon = document.getElementById("dropdown-icon");

  if (event.target.id === "dropdown-icon-container" || event.target.id === "dropdown-icon") {
    if (dropdown && icon) {
      dropdown.classList.toggle("show");
      icon.classList.toggle("rotated");

      if (dropdown.classList.contains("show")) {
        document.addEventListener("click", outsideClickListenerWrapper);
      } else {
        document.removeEventListener("click", outsideClickListenerWrapper);
      }
    }
  } else {
    if (dropdown && !dropdown.classList.contains("show")) {
      dropdown.classList.add("show");
      icon.classList.add("rotated");
      document.addEventListener("click", outsideClickListenerWrapper);
    }
  }

  checkScrollbar();
}

function filterOptions() {
  const input = document.getElementById("search");
  const filter = input.value;
  const assignedMembers = getAssignedMembers();
  renderContactDropdown(assignedMembers);
}

function getAssignedMembers() {
  return selectedOptions.map((id) => globalContacts[id].name);
}

function selectOption(option) {
  const checkbox = option.querySelector(".checkbox");
  const initials = option.querySelector(".badge").innerText.trim();
  const id = option.dataset.id;

  checkbox.checked = !checkbox.checked;
  option.classList.toggle("selected", checkbox.checked);
  checkbox.checked ? addBadge(id, initials, option.querySelector(".badge").style.backgroundColor) : removeBadge(id);
}

function addBadge(id, initials, color) {
  if (!selectedOptions.includes(id)) {
    selectedOptions.push(id);

    const badgeContainer = document.getElementById("selected-badges");
    const badge = document.createElement("div");

    badge.classList.add("selected-badge");
    badge.setAttribute("data-id", id);
    badge.style.backgroundColor = color;
    badge.innerHTML = `<span>${initials}</span>`;
    badgeContainer.appendChild(badge);
  }
}

function removeBadge(id) {
  selectedOptions = selectedOptions.filter((optionId) => optionId !== id);

  const badgeContainer = document.getElementById("selected-badges");
  const badge = badgeContainer.querySelector(`.selected-badge[data-id="${id}"]`);

  if (badge) badge.remove();
}

function initializeBadges() {
  const options = document.querySelectorAll("#contact-dropdown-options li");

  options.forEach((option) => {
    const checkbox = option.querySelector(".checkbox");
    const initials = option.querySelector(".badge").innerText.trim();
    const id = option.dataset.id;

    option.classList.remove("selected");

    if (checkbox.checked) {
      addBadge(id, initials, option.querySelector(".badge").style.backgroundColor);
      option.classList.add("selected");
    }
  });
}

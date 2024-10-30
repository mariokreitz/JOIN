function noContactsTemplate() {
  return /*html*/ `
    <li class="no-contacts">
      <p>No contact was found.</p>
    </li>
  `;
}

function contactListItemTemplate(contact, originalIndex, initials, isSelected) {
  return /*html*/ `
    <li onclick="toggleOptionSelection(this)" data-id="${originalIndex}" class="${isSelected ? "selected" : ""}">
      <span class="badge" style="background-color: ${contact.color}">${initials}</span>
      ${contact.name}
      <input type="checkbox" class="checkbox" ${isSelected ? "checked" : ""} />
      <span class="custom-checkbox"></span>
    </li>
  `;
}

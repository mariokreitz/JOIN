function noContactsTemplate() {
  return /*html*/ `
    <li class="no-contacts">
      <p>No contact was found.</p>
    </li>
  `;
}

function contactListItemTemplate(contact, originalIndex, initials) {
  return /*html*/ `
      <li onclick="selectOption(this)" data-id="${originalIndex}">
          <span class="badge" style="background-color: ${contact.color}">${initials}</span>
          ${contact.name}
          <input type="checkbox" class="checkbox" /><span class="custom-checkbox"></span>
      </li>
  `;
}

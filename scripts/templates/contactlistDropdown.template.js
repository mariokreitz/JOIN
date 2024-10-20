function generateContactListHtml(contacts) {
  if (contacts.length === 0) {
    return /*html*/ `
        <li class="no-contacts">
          <p>No contacts available to assign.</p>
        </li>
      `;
  }

  return contacts
    .map((contact, index) => {
      const initials = getInitialsFromContact(contact);
      return /*html*/ `
        <li onclick="selectOption(this)" data-id="${index}">
          <span class="badge" style="background-color: ${contact.color}">${initials}</span>
          ${contact.name}
          <input type="checkbox" class="checkbox" /><span class="custom-checkbox"></span>
        </li>
      `;
    })
    .join("");
}

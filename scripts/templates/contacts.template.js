/**
 * Returns an HTML template for a contact item.
 *
 * @param {string} initials - The initials of the contact.
 * @param {string} fullName - The full name of the contact.
 * @param {string} email - The email address of the contact.
 * @returns {string} The HTML template for the contact item.
 */
function getContactTemplate(initials, fullName, email) {
  return /*html*/ `
        <li class="contact-item">
            <div class="contact-initials">${initials}</div>
            <div>
                <p class="contact-name">${fullName}</p>
                <p class="contact-email">${email}</p>
            </div>
        </li>
    `;
}

/**
 * Returns an HTML template for a contact item.
 *
 * @param {string} initials - The contact's initials.
 * @param {string} color - The color of the contact's initials.
 * @param {string} fullName - The contact's full name.
 * @param {string} email - The contact's email address.
 * @returns {string} The HTML template.
 */
function getContactTemplate(initials, color, fullName, email) {
  return /*html*/ `
        <li class="contact-item">
            <div class="contact-initials" style="background-color: ${color}">${initials}</div>
            <div>
                <p class="contact-name">${fullName}</p>
                <p class="contact-email">${email}</p>
            </div>
        </li>
    `;
}

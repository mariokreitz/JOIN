/**
 * Given the type, full name, email, phone, initials, and color of a contact, returns an
 * HTML string representing a single contact modal in the contact list.
 *
 * @param {string} type - The type of the contact modal, either "add" or "edit".
 * @param {string} fullName - The full name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} color - The color of the contact's avatar.
 * @returns {string} An HTML string representing the contact modal.
 */

function getContactModalTemplate(type, fullName = "", email = "", phone = "", initials = "", color = "") {
  const isEdit = type === "edit";
  const cancelButtonHtml = /*HTML*/ ` <button onclick="closeContactModal(event)" class="delete-btn">
    Cancel
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.00005 8.40005L2.10005 13.3C1.91672 13.4834 1.68338 13.575 1.40005 13.575C1.11672 13.575 0.883382 13.4834 0.700049 13.3C0.516715 13.1167 0.425049 12.8834 0.425049 12.6C0.425049 12.3167 0.516715 12.0834 0.700049 11.9L5.60005 7.00005L0.700049 2.10005C0.516715 1.91672 0.425049 1.68338 0.425049 1.40005C0.425049 1.11672 0.516715 0.883382 0.700049 0.700049C0.883382 0.516715 1.11672 0.425049 1.40005 0.425049C1.68338 0.425049 1.91672 0.516715 2.10005 0.700049L7.00005 5.60005L11.9 0.700049C12.0834 0.516715 12.3167 0.425049 12.6 0.425049C12.8834 0.425049 13.1167 0.516715 13.3 0.700049C13.4834 0.883382 13.575 1.11672 13.575 1.40005C13.575 1.68338 13.4834 1.91672 13.3 2.10005L8.40005 7.00005L13.3 11.9C13.4834 12.0834 13.575 12.3167 13.575 12.6C13.575 12.8834 13.4834 13.1167 13.3 13.3C13.1167 13.4834 12.8834 13.575 12.6 13.575C12.3167 13.575 12.0834 13.4834 11.9 13.3L7.00005 8.40005Z"
        fill="#2A3647" />
    </svg>
  </button>`;
  return /*HTML*/ `
    <div class="modal-overlay" id="contact-modal">
      <div class="modal-content" id="modal-content">
        <div class="modal-left">
          <div class="logo-container">
            <img src="./assets/svg/logo-white.svg" alt="Logo" />
          </div>
          <h2>${isEdit ? "Edit contact" : "Add contact"}</h2>
          ${!isEdit ? "<p>Tasks are better with a Team!</p>" : ""}
          <div class="underline"></div>
        </div>
        <div class="modal-right">
          <button class="close-btn" onclick="closeContactModal(event)">
            <img src="./assets/svg/close.svg" alt="" />
          </button>
          <div class="modal-right-content">
            <div class="avatar" ${isEdit ? `style="background-color: ${color};"` : ""}>
              ${
                isEdit
                  ? `<span id="avatar-initials">${initials}</span>`
                  : '<img src="assets/svg/person-white.svg" alt="" />'
              }
            </div>
            <form id="contact-form" class="contact-form">
              <div class="input-container">
                <input type="text" id="contact-name" name="name" placeholder="Name" value="${fullName}" required />
                <i class="icon-name"><img src="./assets/svg/person.svg" alt="person icon" /></i>
              </div>
              <div class="input-container"> 
                <input type="email" id="contact-email" name="email" placeholder="Email" value="${email}" required />
                <i class="icon-email"><img src="./assets/svg/mail.svg" alt="letter icon" /></i>
              </div>
              <div class="input-container">
                <input type="tel" id="contact-phone" name="phone" placeholder="Phone" value="${phone}" required />
                <i class="icon-phone"><img src="./assets/svg/call.svg" alt="phone icon" /></i>
              </div>
              <div class="form-actions">
              ${
                isEdit
                  ? `<button class="delete-btn" onclick="event.preventDefault(); deleteContact()">Delete</button>`
                  : cancelButtonHtml
              }
                <button onclick="handleSaveClick(event)" type="submit" class="save-btn">
                  ${isEdit ? "Save" : "Create contact"}
                  <img class="check-mark" src="./assets/svg/check-mark.svg" alt="" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

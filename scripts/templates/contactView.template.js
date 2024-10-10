function getContactViewTemplate(initials, contact) {
  return /*html*/ `
        <div class="contact-main-card">
            <div class="contact-main-header">
                <div class="contact-main-initials">${initials}</div>
                <div class="contact-main-info">
                    <p>${contact.name}</p>
                    <div class="contact-main-controls"></div>
                </div>
            </div>
            <p class="contact-main-infotext">Contact Information</p>
            <div class="contact-main-details">
                <div class="contact-main-details-email">
                    <span></span>
                    <span>${contact.email}</span>
                </div>
                <div class="contact-main-details-phone">
                    <span></span>
                    <span>${contact.phone}</span>
                </div>
            </div>
        </div>
    `;
}

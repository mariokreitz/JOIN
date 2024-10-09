function getContactTemplate(initials, fullName, email) {
  return /*html*/ `
        <div class="contact-item">
            <div class="contact-initials">${initials}</div>
            <div>
                <p class="contact-name">${fullName}</p>
                <p class="contact-email">${email}</p>
            </div>
        </div>
    `;
}

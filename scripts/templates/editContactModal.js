function getEditContactModalTemplate() {
  return /* HTML */ `
    <div class="modal-overlay" id="edit-contact-modal">
      <div class="modal-content">
        <div class="modal-left">
          <div class="logo-container">
            <img src="./assets/svg/logo-white.svg" alt="Logo" />
          </div>
          <h2>Edit contact</h2>
          <div class="underline"></div>
        </div>
        <div class="modal-right">
          <button class="close-btn" onclick="closeEditContactModal()">
            <img src="./assets/svg/close.svg" alt="" />
          </button>
          <div class="modal-right-content">
            <div class="avatar">
              <span id="avatar-initials">TW</span>
            </div>
            <form class="contact-form">
              <div class="input-container">
                <input type="text" id="contact-name" placeholder="Name" />
                <i class="icon-name"><img src="./assets/svg/person.svg" alt="" /></i>
              </div>
              <div class="input-container">
                <input type="email" id="contact-email" placeholder="Email" />
                <i class="icon-email"><img src="./assets/svg/mail.svg" alt="" /></i>
              </div>
              <div class="input-container">
                <input type="tel" id="contact-phone" placeholder="Phone" />
                <i class="icon-phone"><img src="./assets/svg/call.svg" alt="" /></i>
              </div>
              <div class="form-actions">
                <button class="delete-btn">Delete</button>
                <button class="save-btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

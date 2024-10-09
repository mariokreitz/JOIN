function getEditContactModalTemplate() {
  return /* HTML */ `
    <div class="modal-overlay" id="edit-contact-modal">
      <div class="modal-content">
        <div class="modal-left">
          <div class="logo-container">
            <img src="./assets/svg/logo-white.svg" alt="Logo" />
          </div>
          <h2>Edit contact</h2>
        </div>
        <div class="modal-right">
          <button class="close-btn" onclick="closeEditContactModal()">&times;</button>
          <div class="modal-right-content">
            <div class="avatar">
              <span id="avatar-initials">TW</span>
            </div>
            <form class="contact-form">
              <input type="text" id="contact-name" placeholder="Name" />
              <input type="email" id="contact-email" placeholder="Email" />
              <input type="tel" id="contact-phone" placeholder="Phone" />
              <div class="form-actions">
                <button class="delete-btn">Delete</button>
                <button class="save-btn">
                  Save <img class="check-mark" src="assets/svg/check-mark.svg" alt="Check Mark" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

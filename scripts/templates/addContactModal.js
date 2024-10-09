function getAddContactModalTemplate() {
  return /* HTML */ `
    <div class="modal-overlay" id="add-contact-modal">
      <div class="modal-content">
        <div class="modal-left">
          <div class="logo-container">
            <img src="./assets/svg/logo-white.svg" alt="Logo" />
          </div>
          <h2>Add contact</h2>
          <p>Tasks are better with a Team!</p>
          <div class="underline"></div>
        </div>
        <div class="modal-right">
          <button class="close-btn" onclick="closeContactModal()">
            <img src="./assets/svg/close.svg" alt="" />
          </button>
          <div class="modal-right-content">
            <div class="avatar">
              <img src="assets/svg/person-white.svg" alt="" />
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
                <button class="delete-btn">
                  Delete
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7.00005 8.40005L2.10005 13.3C1.91672 13.4834 1.68338 13.575 1.40005 13.575C1.11672 13.575 0.883382 13.4834 0.700049 13.3C0.516715 13.1167 0.425049 12.8834 0.425049 12.6C0.425049 12.3167 0.516715 12.0834 0.700049 11.9L5.60005 7.00005L0.700049 2.10005C0.516715 1.91672 0.425049 1.68338 0.425049 1.40005C0.425049 1.11672 0.516715 0.883382 0.700049 0.700049C0.883382 0.516715 1.11672 0.425049 1.40005 0.425049C1.68338 0.425049 1.91672 0.516715 2.10005 0.700049L7.00005 5.60005L11.9 0.700049C12.0834 0.516715 12.3167 0.425049 12.6 0.425049C12.8834 0.425049 13.1167 0.516715 13.3 0.700049C13.4834 0.883382 13.575 1.11672 13.575 1.40005C13.575 1.68338 13.4834 1.91672 13.3 2.10005L8.40005 7.00005L13.3 11.9C13.4834 12.0834 13.575 12.3167 13.575 12.6C13.575 12.8834 13.4834 13.1167 13.3 13.3C13.1167 13.4834 12.8834 13.575 12.6 13.575C12.3167 13.575 12.0834 13.4834 11.9 13.3L7.00005 8.40005Z"
                      fill="#2A3647" />
                  </svg>
                </button>
                <button class="save-btn">
                  Create contact <img class="check-mark" src="./assets/svg/check-mark.svg" alt="" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

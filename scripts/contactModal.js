/**
 * Timeout in milliseconds that is used for how long the warning in the form
 * validation is shown.
 * @constant {number}
 */
const TIMEOUT = 2000;

function openContactModal(type, name = "", email = "", phone = "", color = "") {
  const initials = type === "edit" ? getInitials(name) : "";
  const modalHtml = getContactModalTemplate(type, name, email, phone, initials, color);
  let modalElement = document.getElementById("contact-modal");
  if (modalElement) modalElement.remove();
  document.body.insertAdjacentHTML("beforeend", modalHtml);
  applyAnimation("slide-in");
}

function closeContactModal() {
  const modal = document.getElementById("contact-modal");
  if (modal) {
    applyAnimation("slide-out");
    modal.addEventListener("animationend", () => modal.remove());
  }
}

function applyAnimation(animationType) {
  const modalContent = document.getElementById("modal-content");
  modalContent.style.animation = `${animationType} 0.3s ease-out forwards`;
}

function getInitials(fullName) {
  const nameParts = fullName.split(" ");
  const initials = nameParts[0].charAt(0) + (nameParts[1] ? nameParts[1].charAt(0) : "");
  return initials.toUpperCase();
}

/**
 * Handles the save button click event.
 *
 * If the button text is "Save", calls updateContact with the contact name.
 * If the button text is "Add", calls createContact.
 *
 * @param {Event} event - The click event.
 *
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
async function handleSaveClick(event) {
  event.preventDefault();

  const saveButton = document.querySelector(".save-btn");

  if (!saveButton) return;

  if (saveButton.innerText.includes("Save")) {
    const contactNameElement = document.getElementById("contact-main-name");
    const contactName = contactNameElement.innerText;
    await updateContact(contactName);
  } else {
    await createContact();
  }
}

/**
 * Updates a contact in Firebase Realtime Database.
 *
 * @param {string} contactName The name of the contact to update.
 *
 * @returns {Promise<void>} A promise that resolves when the contact has been
 * updated.
 */
async function updateContact(contactName) {
  const contactForm = document.getElementById("contact-form");

  const contactIndex = await getContactIndexByName(contactName);

  if (contactForm && contactIndex >= 0 && validateFormdata()) {
    const formData = new FormData(contactForm);
    const updatedContact = {
      createdAt: Date.now(),
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    const status = await patchDataInFirebase(API_URL, "contacts", updatedContact, contactIndex);
    console.log(status);

    closeContactModal();
    renderContactsPage();
    await selectLatestCreatedContact();
  }
}

/**
 * Creates a new contact in Firebase Realtime Database.
 *
 * @returns {Promise<void>} A promise that resolves when the contact has been
 * created.
 */
async function createContact() {
  if (!validateFormdata()) return;
  const status = await postData();
  console.log(status);

  closeContactModal();
  renderContactsPage();
  await selectLatestCreatedContact();
}

/**
 * Validates the form data in the contact form.
 *
 * @returns {boolean} True if the form is valid, false otherwise.
 */
function validateFormdata() {
  const { name, email, phone } = getFormData();

  const nameRegex = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
  const emailRegex = /^\S+@\S+\.\S+$/;
  const phoneRegex = /^\+?\d{1,3}?[-.\s]?(\(?\d{1,5}?\)?[-.\s]?)?\d{5,12}$/;

  if (!nameRegex.test(name)) {
    showNameWarning();
    return false;
  }
  if (!emailRegex.test(email)) {
    showEmailWarning();
    return false;
  }
  if (!phoneRegex.test(phone)) {
    showPhoneWarning();
    return false;
  }
  return true;
}

/**
 * Gets the form data from the contact form.
 *
 * @returns {Object} An object with the form data: {name: string, email: string, phone: string}.
 */
function getFormData() {
  const contactForm = document.getElementById("contact-form");
  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  return { name, email, phone };
}

/**
 * Shows a warning message for the contact name input field when the name is not in the
 * correct format. The warning message is shown for 2 seconds and then removed.
 * @returns {void}
 */
function showNameWarning() {
  const inputNameField = document.getElementById("contact-name");
  inputNameField.style.borderColor = "red";
  inputNameField.insertAdjacentHTML(
    "afterend",
    `<p style="color: red; font-size: 12px;">Name must be in the format: Firstname Lastname</p>`
  );
  setTimeout(() => {
    inputNameField.style.borderColor = "";
    const feedback = inputNameField.nextElementSibling;
    if (feedback && feedback.tagName === "P") {
      feedback.remove();
    }
  }, TIMEOUT);
}

/**
 * Shows a warning message for the contact email input field when the email is not in the
 * correct format. The warning message is shown for 2 seconds and then removed.
 * @returns {void}
 */
function showEmailWarning() {
  const inputEmailField = document.getElementById("contact-email");
  inputEmailField.style.borderColor = "red";
  inputEmailField.insertAdjacentHTML(
    "afterend",
    `<p style="color: red; font-size: 12px;">Email must be in the format: example@domain.com</p>`
  );
  setTimeout(() => {
    inputEmailField.style.borderColor = "";
    const feedback = inputEmailField.nextElementSibling;
    if (feedback && feedback.tagName === "P") {
      feedback.remove();
    }
  }, TIMEOUT);
}

/**
 * Shows a warning message for the contact phone input field when the phone is not in the
 * correct format. The warning message is shown for 2 seconds and then removed.
 * @returns {void}
 */
function showPhoneWarning() {
  const inputPhoneField = document.getElementById("contact-phone");
  inputPhoneField.style.borderColor = "red";
  inputPhoneField.insertAdjacentHTML(
    "afterend",
    `<p style="color: red; font-size: 12px;">Phone number cannot be empty</p>`
  );
  setTimeout(() => {
    inputPhoneField.style.borderColor = "";
    const feedback = inputPhoneField.nextElementSibling;
    if (feedback && feedback.tagName === "P") {
      feedback.remove();
    }
  }, TIMEOUT);
}

/**
 * Selects the latest created contact item in the contact list by toggling the
 * contact view.
 *
 * @returns {Promise<void>} A promise that resolves when the contact view has been
 * toggled.
 */
async function selectLatestCreatedContact() {
  const latestContact = await getLatestCreatedContact();
  const contactElements = [...document.querySelectorAll(".contact-item")];
  const selectedContactElement = contactElements.find(
    (contactElement) => contactElement.querySelector(".contact-name").textContent === latestContact.name
  );
  const index = selectedContactElement ? parseInt(selectedContactElement.dataset.sortedIndex) : null;

  toggleContactView(index);
}

async function deleteContact(contactName) {
  const contactIndex = await getContactIndexByName(contactName);

  if (contactIndex >= 0) {
    const status = await deleteDataInFirebase(API_URL, "contacts", contactIndex);

    console.log(status);
    closeContactModal();
    removeContactView();
    renderContactsPage();
  } else {
    console.error("Contact not found.");
  }
}

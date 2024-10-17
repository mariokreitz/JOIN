/**
 * An array of colors that can be used to color user profiles.
 * @type {Array<string>}
 */
const profileColors = [
  "#FF7A00",
  "#FF5EB3",
  "#6E52FF",
  "#9327FF",
  "#00BEE8",
  "#1FC7C1",
  "#8B9467",
  "#FF745E",
  "#FFA35E",
  "#FC71FF",
  "#FFC701",
  "#0038FF",
  "#B22222",
  "#C3FF2B",
  "#FFE62B",
  "#FF4646",
  "#FFBB2B",
  "#FF7A00",
  "#FF5EB3",
  "#6E52FF",
];

/**
 * Timeout in milliseconds that is used for how long the warning in the form
 * validation is shown.
 * @constant {number}
 */
const TIMEOUT = 2000;

function openContactModal(type, name = "", email = "", phone = "", color = "") {
  const initials = type === "edit" ? getInitialsFromContact({ name: name }) : "";
  const modalHtml = getContactModalTemplate(type, name, email, phone, initials, color);
  let modalElement = document.getElementById("contact-modal");
  if (modalElement) modalElement.remove();
  document.body.insertAdjacentHTML("beforeend", modalHtml);
  applyAnimation("slide-in");
}

/**
 * Closes the contact modal, removing it from the DOM.
 *
 * @param {Event} [event] - Optional event.
 */
function closeContactModal(event) {
  if (event) event.preventDefault();
  const modal = document.getElementById("contact-modal");
  if (modal) {
    applyAnimation("slide-out");
    modal.addEventListener("animationend", () => modal.remove());
  }
}

/**
 * Applies the given animation to the modal content element. The animation is
 * applied by setting the animation CSS property on the element.
 * @param {string} animationType - The type of animation to apply.
 */
function applyAnimation(animationType) {
  const modalContent = document.getElementById("modal-content");
  modalContent.style.animation = `${animationType} 0.3s ease-out forwards`;
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

  const initials = getInitialsFromContact({ name: contactName });
  const contactIndex = await getContactIndexByName(contactName, "guest/contacts", initials);

  if (contactForm && contactIndex >= 0 && validateFormdata()) {
    const formData = new FormData(contactForm);
    const updatedContact = {
      createdAt: Date.now(),
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    const status = await patchDataInFirebase(API_URL, "guest/contacts", initials, contactIndex, updatedContact);
    showToastMessage("update", status);

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
  const fullName = document.getElementById("contact-name").value;
  const email = document.getElementById("contact-email").value;
  const phone = document.getElementById("contact-phone").value;

  if (!validateFormdata()) return;

  const profileColor = profileColors[Math.floor(Math.random() * profileColors.length)];
  const createdAt = Date.now();

  const newContact = {
    color: profileColor,
    contactSelect: false,
    createdAt,
    email: email,
    name: fullName,
    phone: phone,
  };
  const status = await putDataInFirebase(newContact, "guest");
  showToastMessage("create", status);

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

  const nameRegex = /^[A-Z][a-z]+(-[A-Z][a-z]+)* [A-Z][a-z]+$/;
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
  const latestContact = await getLatestCreatedContact("guest");
  const contactElements = [...document.querySelectorAll(".contact-item")];
  const selectedContactElement = contactElements.find(
    (contactElement) => contactElement.querySelector(".contact-name").textContent === latestContact.name
  );
  const index = selectedContactElement ? parseInt(selectedContactElement.dataset.sortedIndex) : null;

  toggleContactView(index);
}

async function deleteContact(contactName) {
  const initials = getInitialsFromContact({ name: contactName });
  const contactIndex = await getContactIndexByName(contactName, "guest/contacts", initials);

  if (contactIndex >= 0) {
    const status = await deleteDataInFirebase(API_URL, `guest/contacts/${initials}${contactIndex}`);

    showToastMessage("delete", status);
    closeContactModal();
    removeContactView();
    renderContactsPage();
  } else {
    const status = await deleteDataInFirebase(API_URL, `guest/contacts/${contactIndex}`);
    showToastMessage("delete", status);
    closeContactModal();
    removeContactView();
    renderContactsPage();
  }
}

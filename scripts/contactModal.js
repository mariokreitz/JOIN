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
 * Handles the save button click in the contact modal.
 *
 * If the button says "Save", it will update a contact. It will find the contact
 * to update based on the data-created-at attribute of the #createdAt element.
 *
 * If the button says "Add", it will create a contact.
 *
 * @param {Event} event - The save button click event.
 * @returns {Promise<void>}
 */
async function handleSaveClick(event) {
  event.preventDefault();
  const saveBtn = document.querySelector(".save-btn");

  if (!saveBtn) return;
  const isSave = saveBtn.innerText.includes("Save");

  if (isSave) {
    const contactNameElement = document.getElementById("createdAt");
    if (!contactNameElement) return;

    const createdAt = Number(contactNameElement.dataset.createdat);
    const contact = globalContacts.find((c) => c.createdAt === createdAt);

    await updateContact(contact);
  } else {
    await createContact();
  }
}

/**
 * Updates the contact with the given createdAt time with the current form data.
 * The function first retrieves the contact id by createdAt and user, then
 * creates an updated contact object by spreading the form data and adding the
 * current timestamp for createdAt. The function then calls patchDataInFirebase
 * to update the contact in the database and shows a toast message with the
 * status of the operation. Finally, the function closes the contact modal,
 * renders the contacts page and selects the latest created contact.
 *
 * @param {Object} contact - The contact to be updated.
 * @returns {Promise<void>}
 */
async function updateContact(contact) {
  const contactForm = document.getElementById("contact-form");
  const contactId = await getContactIdByCreatedAt("guest", contact.createdAt);

  if (contactForm && contactId && validateFormdata()) {
    const updatedContact = {
      ...Object.fromEntries(new FormData(contactForm)),
      createdAt: Date.now(),
    };

    const status = await updateContactInDatabase("guest", contactId, updatedContact);
    showToastMessage("update", status);
    closeContactModal();
    renderContactsPage();
    await selectLatestCreatedContact();
  }
}

/**
 * Creates a new contact with the form data and adds it to the Firebase Realtime
 * Database. The function first retrieves the form data, validates it, and
 * creates a new contact object by spreading the form data and adding the current
 * timestamp for createdAt. The function then calls putDataInFirebase to add the
 * contact to the database and shows a toast message with the status of the
 * operation. Finally, the function closes the contact modal, renders the
 * contacts page and selects the latest created contact.
 *
 * @returns {Promise<void>}
 */
async function createContact() {
  const formData = getFormData();

  if (!validateFormdata()) return;

  const profileColor = profileColors[Math.floor(Math.random() * profileColors.length)];
  const createdAt = Date.now();

  const newContact = { ...formData, color: profileColor, contactSelect: false, createdAt };
  const status = await createContactInDatabase("guest", newContact);

  if (status.status === 200) {
    showToastMessage("create", status);
    closeContactModal();
    renderContactsPage();
    await selectLatestCreatedContact();
  } else {
    showToastMessage("exists", status);
  }
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
 * Selects the latest created contact from the list of contacts and shows its details
 * in the contact view by calling `toggleContactView` with the index of the contact.
 *
 * @returns {Promise<void>}
 */
async function selectLatestCreatedContact() {
  const latestContact = await getLatestCreatedContact("guest");
  const contactElements = [...document.querySelectorAll(".contact-item")];
  const selectedContactElement = contactElements.find(
    (contactElement) => contactElement.querySelector(".contact-name").textContent === latestContact.name
  );
  const index = selectedContactElement ? parseInt(selectedContactElement.dataset.sortedIndex, 10) : null;

  toggleContactView(index);
}

/**
 * Deletes the contact with the id specified in the data-created-at attribute of the
 * #createdAt element from the Firebase Realtime Database. If the deletion is successful,
 * the contact view is removed and the contacts page is re-rendered.
 *
 * @returns {Promise<void>}
 */
async function deleteContact() {
  const contactCreatedAtElement = document.getElementById("createdAt");

  if (!contactCreatedAtElement) return;

  const contactId = await getContactIdByCreatedAt("guest", Number(contactCreatedAtElement.dataset.createdat));

  if (!contactId) return;

  const status = await deleteContactFromDatabase("guest", contactId);

  showToastMessage("delete", status);
  closeContactModal();
  removeContactView();
  renderContactsPage();
}

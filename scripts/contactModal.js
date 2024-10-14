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

  if (contactForm && contactIndex >= 0) {
    const formData = new FormData(contactForm);
    const updatedContact = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    const status = await patchDataInFirebase(API_URL, "contacts", updatedContact, contactIndex);
    console.log(status);

    closeContactModal();
    renderContactsPage();
  }
}

async function createContact() {
  const status = await postData();
  console.log(status);

  closeContactModal();
  renderContactsPage();
  await selectLatestCreatedContact();
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

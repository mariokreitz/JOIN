function openContactModal(type, name = "", email = "", phone = "") {
  const initials = type === "edit" ? getInitials(name) : "";
  const modalHtml = getContactModalTemplate(type, name, email, phone, initials);
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
 * When the save button is clicked, it prevents the default event behavior, gets
 * the contact name from the contact main name element, and checks if the save
 * button's inner text includes the word "Save". If it does, it calls the
 * updateContact function with the contact name, passing the promise to the
 * caller. If it doesn't, it calls the createContact function, passing the
 * promise to the caller.
 *
 * @param {Event} event The save button click event.
 * @returns {Promise<void>} A promise that resolves when the contact has been
 * saved.
 */
async function handleSaveClick(event) {
  event.preventDefault();

  const contactNameElement = document.getElementById("contact-main-name");
  const saveButton = document.querySelector(".save-btn");

  if (!saveButton || !contactNameElement) return;

  const contactName = contactNameElement.innerText;

  if (saveButton.innerText.includes("Save")) {
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
  }
}

async function createContact() {
  await postData();
}

async function deleteContact(contactName) {
  const contactIndex = await getContactIndexByName(contactName);

  if (contactIndex >= 0) {
    const status = await deleteDataInFirebase(API_URL, "contacts", contactIndex);

    console.log(status);
    closeContactModal();
  } else {
    console.error("Contact not found.");
  }
}

async function deleteDataInFirebase(apiUrl, endpoint, contactIndex) {
  const response = await fetch(`${apiUrl}/${endpoint}/${contactIndex}.json`, {
    method: "DELETE",
  });

  if (response.ok) {
    return "Contact deleted successfully.";
  } else {
    return "Failed to delete contact.";
  }
}

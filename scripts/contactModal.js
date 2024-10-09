function openEditContactModal(fullName, email, phone) {
  const modalHtml = getEditContactModalTemplate();
  const initials = getInitials(fullName);
  document.body.insertAdjacentHTML("beforeend", modalHtml);
  document.getElementById("contact-name").value = fullName;
  document.getElementById("contact-email").value = email;
  document.getElementById("contact-phone").value = phone;
  document.getElementById("avatar-initials").textContent = initials;
}

function getInitials(fullName) {
  const nameParts = fullName.split(" ");
  const initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
  return initials.toUpperCase();
}

function closeEditContactModal() {
  const modal = document.getElementById("edit-contact-modal");
  if (modal) {
    modal.remove();
  }
}

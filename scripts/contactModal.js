function openContactModal(type, fullName = "", email = "", phone = "") {
  const initials = type === "edit" ? getInitials(fullName) : "";
  const modalHtml = getContactModalTemplate({
    type,
    fullName,
    email,
    phone,
    initials,
  });
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

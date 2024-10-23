function outsideClickListener(event, dropdownId, iconId) {
  const dropdown = document.getElementById(dropdownId);
  const icon = document.getElementById(iconId);
  const input = document.getElementById("search");

  if (dropdown && icon) {
    if (
      !dropdown.contains(event.target) &&
      !icon.contains(event.target) &&
      !input.contains(event.target) &&
      input.value.trim() === ""
    ) {
      dropdown.classList.remove("show");
      icon.classList.remove("rotated");
      document.removeEventListener("click", outsideClickListenerWrapper);
    }
  }
}

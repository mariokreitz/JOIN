function outsideClickListener(event, dropdownId, iconId) {
  var dropdown = document.getElementById(dropdownId);
  var icon = document.getElementById(iconId);
  var input = document.getElementById("search");

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

function outsideClickListenerWrapper(event) {
  outsideClickListener(event, "contact-dropdown-options", "dropdown-icon");
}

function outsideClickListenerWrapperCategory(event) {
  outsideClickListener(event, "category-dropdown-options", "category-dropdown-icon");
}

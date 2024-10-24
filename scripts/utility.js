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

function checkScrollbar() {
  const subtaskList = document.getElementById("subtask-list");

  if (subtaskList) {
    subtaskList.style.padding = subtaskList.scrollHeight > subtaskList.clientHeight ? "10px" : "0";
  }

  const elements = [
    document.getElementById("edit-card-form-container"),
    document.getElementById("big-card-form-container"),
  ];

  elements.forEach((el) => {
    if (el) {
      const padding = el.scrollHeight > el.clientHeight ? "15px" : "0";
      const margin = el.scrollHeight > el.clientHeight ? "-25px" : "0";
      el.style.paddingRight = padding;
      el.style.marginRight = margin;
    }
  });
}

window.addEventListener("resize", checkScrollbar);

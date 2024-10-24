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

function validateTodoForm() {
  const titleField = document.getElementById("title") || document.getElementById("bc-todo-titel");
  const dueDateField = document.getElementById("due-date");
  const categoryField = document.getElementById("select-category");
  let isValid = true;
  clearWarnings();

  if (!titleField || !titleField.value.trim()) {
    isValid = false;
    showWarning(titleField, "Title is required.");
  }

  if (!dueDateField || !dueDateField.value) {
    isValid = false;
    showWarning(dueDateField, "Due date is required.");
  }

  if (categoryField && categoryField.textContent.trim() === "Select task category") {
    isValid = false;
    showWarning(categoryField, "Category is required.");
  }

  return isValid;
}

function showWarning(inputField, message) {
  if (inputField.tagName === "INPUT") {
    inputField.style.borderColor = "red";
    inputField.insertAdjacentHTML("afterend", `<p class="warning-text">${message}</p>`);
  } else if (inputField.tagName === "DIV") {
    inputField.style.borderColor = "red";
    const parentElement = inputField.parentNode;
    parentElement.insertAdjacentHTML("afterend", `<p class="warning-text">${message}</p>`);
  }

  setTimeout(() => {
    inputField.style.borderColor = "";
    clearWarnings();
  }, 3000);
}

function clearWarnings() {
  const warnings = document.querySelectorAll(".warning-text");
  warnings.forEach((warning) => warning.remove());
}

window.addEventListener("resize", checkScrollbar);

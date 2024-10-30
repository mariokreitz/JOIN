/**
 * Listens for a click event on the document and checks if the target of the event
 * is not the dropdown, its toggler, or the search input. If the conditions are
 * met, the dropdown is hidden.
 *
 * @param {{ target: HTMLElement }} event - The event object from the click event.
 * @param {string} dropdownId - The id of the dropdown to be hidden.
 * @param {string} iconId - The id of the icon to be rotated.
 * @returns {void}
 */
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
    }
  }
}

/**
 * Calls outsideClickListener with the contact dropdown options and icon.
 *
 * @param {{ target: HTMLElement }} event - The event object from the click event.
 * @returns {void}
 */
function outsideClickListenerWrapper(event) {
  outsideClickListener(event, "contact-dropdown-options", "dropdown-icon");
}

/**
 * Calls outsideClickListener with the category dropdown options and icon.
 *
 * @param {{ target: HTMLElement }} event - The event object from the click event.
 * @returns {void}
 */
function outsideClickListenerWrapperCategory(event) {
  outsideClickListener(event, "category-dropdown-options", "category-dropdown-icon");
}

/**
 * Listens for a click event on the document and calls
 * outsideClickListenerWrapper and outsideClickListenerWrapperCategory
 * to hide the contact dropdown and category dropdown if the
 * target element is not one of their children.
 *
 * @listens document#click
 * @param {{ target: HTMLElement }} event - The event object from the click event
 * @returns {void}
 */
document.addEventListener("click", function (event) {
  outsideClickListenerWrapper(event);
  outsideClickListenerWrapperCategory(event);
});

/**
 * Validates the add task form fields. If the title or due date are empty,
 * or if the category is not selected, it shows a warning and returns false.
 * Otherwise, it clears any warnings and returns true.
 *
 * @returns {boolean} If the form is valid or not.
 */
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

/**
 * Shows a warning message for a given input field. If the input field is an input element, the message is inserted after the element.
 * If the input field is a div element, the message is inserted after the parent element of the div.
 * The warning message is visible for 3 seconds and then removed.
 * @param {HTMLElement} inputField - The input field element to display the warning message for.
 * @param {string} message - The warning message to display.
 */
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

/**
 * Clears all warning messages displayed in the form by selecting elements
 * with the class "warning-text" and removing them from the DOM.
 *
 * @returns {void}
 */
function clearWarnings() {
  const warnings = document.querySelectorAll(".warning-text");
  warnings.forEach((warning) => warning.remove());
}

/**
 * Checks for overflow on specific elements and adjusts padding and margin to account for scrollbars.
 * Adds padding to the subtask list if it has a vertical scrollbar and adjusts the padding and margin
 * of specified form containers.
 *
 * @returns {void}
 */
function checkScrollbar() {
  const subtaskList = document.getElementById("subtask-list");
  if (subtaskList) {
    subtaskList.style.paddingRight = subtaskList.scrollHeight > subtaskList.clientHeight ? "5px" : "0";
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

/**
 * Listens for the window resize event and calls the checkScrollbar function
 * when fired.
 *
 * This is necessary because the subtask list is rendered with a masonry
 * layout, which needs to be re-laid out when the window is resized.
 *
 * @listens window#resize
 * @returns {void}
 */
window.addEventListener("resize", checkScrollbar);

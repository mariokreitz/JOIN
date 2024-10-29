/**
 * Initializes the page by loading components and rendering the contact dropdown.
 * @returns {Promise<void>} A promise that resolves when the page has been initialized.
 */
async function init() {
  loadComponents();
  await getContactsFromData("guest");
  document.getElementById("add-task-main").innerHTML = getAddTaskTemplate();
  renderContactDropdown();
  setDefaultPriority();
  restrictPastDatePick();
}

/**
 * Loads all necessary components into the page.
 * @returns {void}
 */
function loadComponents() {
  loadHeader();
  loadNavbar();
}

/**
 * Loads the header component into the element with the id "header".
 * @returns {void}
 */
function loadHeader() {
  const header = document.getElementById("header");
  if (header) {
    header.innerHTML = getHeaderTemplate();
  }
}

/**
 * Loads the navbar component into the element with the id "navbar".
 * @returns {void}
 */
function loadNavbar() {
  const navbar = document.getElementById("navbar");
  if (navbar) {
    navbar.innerHTML = getNavbarTemplate("add-task");
  }
}

/**
 * Handles a click event on a priority button by removing the active class
 * from all other priority buttons and setting the active class on the
 * clicked button. It also updates the global priority variable.
 *
 * @param {MouseEvent} event - The event object of the click event.
 * @returns {void}
 */
function handlePrioChange(event) {
  const buttons = document.querySelectorAll(".priority-actions button");
  const clickedButton = event.currentTarget;

  buttons.forEach((button) => button.classList.remove("active"));
  clickedButton.classList.add("active");
  priority = clickedButton.getAttribute("data-priority");
}

/**
 * Sets the priority of the task to medium by default.
 *
 * This function is called when the page is initialized to set the initial
 * priority of the task to medium. It adds the active class to the medium
 * priority button and updates the global priority variable.
 *
 * @returns {void}
 */
function setDefaultPriority() {
  const mediumButton = document.querySelector('button[data-priority="medium"]');
  mediumButton.classList.add("active");
  priority = "medium";
}

/**
 * Toggles the visibility of the category dropdown menu and rotates the dropdown icon.
 *
 * When the dropdown is shown, it adds an event listener to detect clicks outside
 * the dropdown, which will hide the dropdown and rotate the icon back.
 *
 * @param {Event} event - The event object from the click event.
 * @returns {void}
 */
function toggleCategoryDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById("category-dropdown-options");
  const icon = document.getElementById("category-dropdown-icon");

  dropdown.classList.toggle("show");
  icon.classList.toggle("rotated");

  if (dropdown.classList.contains("show")) {
    document.addEventListener("click", outsideClickListenerWrapper);
  } else {
    document.removeEventListener("click", outsideClickListenerWrapper);
  }

  /**
   * Calls outsideClickListener with the category dropdown options and icon.
   *
   * @param {{ target: HTMLElement }} event - The event object from the click event.
   * @returns {void}
   */
  function outsideClickListenerWrapper(event) {
    outsideClickListener(event, "category-dropdown-options", "category-dropdown-icon");
  }
}

/**
 * Selects a category from the dropdown and updates the displayed category name.
 *
 * This function handles the selection of a category from the category dropdown menu.
 * It stops the event from propagating, removes the 'selected' class from all category
 * options, updates the text content of the selected category element with the provided
 * category name, and then adds the 'selected' class to the chosen category option.
 * Finally, it toggles the visibility of the category dropdown menu.
 *
 * @param {Event} event - The event object from the click event.
 * @param {string} selectedCategoryName - The name of the category to be selected.
 * @returns {void}
 */
function selectCategory(event, selectedCategoryName) {
  const selectedCategoryElement = document.getElementById("select-category");

  event.stopPropagation();

  const categoryOptions = document.querySelectorAll("#category-dropdown-options li");
  categoryOptions.forEach((option) => option.classList.remove("selected"));

  selectedCategoryElement.textContent = selectedCategoryName;

  const selectedOption = Array.from(categoryOptions).find(
    (option) => option.textContent.trim() === selectedCategoryName
  );
  if (selectedOption) {
    selectedOption.classList.add("selected");
  }

  toggleCategoryDropdown(event);
}

/**
 * Opens the date picker for the due date input field and focuses on it.
 *
 * This function prevents the event from propagating and programmatically
 * focuses on and clicks the due date input element to display the date picker.
 *
 * @param {Event} event - The event object from the click event.
 * @returns {void}
 */
function openDatePicker(event) {
  event.stopPropagation();

  const dueDateInput = document.getElementById("due-date");
  dueDateInput.focus();
  dueDateInput.click();
}

/**
 * Clears all the input fields in the add task form and resets all the
 * selected state, including the category, priority, contacts, and subtasks.
 *
 * @returns {void}
 */

function clearForm() {
  clearInputFields();

  const selectedCategoryElement = document.getElementById("select-category");
  selectedCategoryElement.textContent = "Select task category";

  const selectedBadgesElement = document.getElementById("selected-badges");
  selectedBadgesElement.innerHTML = "";

  const priorityButtons = document.querySelectorAll(".priority-actions button");
  priorityButtons.forEach((button) => button.classList.remove("active"));
  setDefaultPriority();

  const subtasksContainer = document.getElementById("subtask-list");
  if (subtasksContainer) subtasksContainer.innerHTML = "";

  const contactOptions = document.querySelectorAll("#contact-dropdown-options li");
  contactOptions.forEach((option) => {
    const checkbox = option.querySelector(".checkbox");
    if (checkbox) {
      checkbox.checked = false;
      option.classList.remove("selected");
    }
  });

  selectedOptions = [];
  priority = "";
  subTasks = {};
  checkScrollbar();
}

/**
 * Clears the input fields of the add-task form by setting the value of the
 * specified elements to an empty string.
 *
 * @returns {void}
 */
function clearInputFields() {
  const inputIds = ["title", "description", "due-date", "subtasks", "search"];
  inputIds.forEach((id) => {
    const inputElement = document.getElementById(id);
    if (inputElement) {
      inputElement.value = "";
    }
  });
}

/**
 * Creates a new todo item with the values from the add-task form and adds it to the
 * globalTodos object. After creating the todo item, it updates the Firebase Realtime
 * Database and clears the form.
 *
 * @returns {Promise<void>} - A promise that resolves when the todo item is created and
 * the data is updated in the Firebase Realtime Database.
 */
async function createTodo() {
  if (!validateTodoForm()) {
    return;
  }

  const dateNow = Date.now();
  const id = "TODO" + dateNow;
  const assignedMembers = selectedOptions.map((id) => globalContacts[id].name);
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const dueDate = document.getElementById("due-date").value;
  const category = document.getElementById("select-category").textContent;

  const subTasksObject = Object.keys(subTasks).reduce((acc, key) => {
    if (subTasks[key]) {
      acc[key] = subTasks[key];
    }
    return acc;
  }, {});

  const todos = {
    [id]: {
      assignedMembers: assignedMembers,
      category: category,
      createdAt: dateNow,
      date: dueDate,
      description: description,
      priority: priority,
      state: globalState,
      subTasks: subTasksObject,
      title: title,
    },
  };

  try {
    const status = await updateTodosInFirebase("guest", todos);
    const modal = document.getElementById("add-task-modal");
    showToastMessage("taskAdded", status);
    if (modal) {
      await getTodosFromData("guest");
      clearBoardColumns();
      renderTodos(globalTodos);
      renderAllPlaceholder();
      closeAddTaskModal();
    }
  } catch (error) {
    const response = await updateTodosInFirebase("guest", todos);
    showToastMessage("error", response);
    console.log(`Failed to create a new task: ${error.message}`);
  }

  clearForm();
}

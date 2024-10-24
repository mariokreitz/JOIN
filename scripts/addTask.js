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

function handlePrioChange(event) {
  const buttons = document.querySelectorAll(".priority-actions button");
  const clickedButton = event.currentTarget;

  buttons.forEach((button) => button.classList.remove("active"));
  clickedButton.classList.add("active");
  priority = clickedButton.getAttribute("data-priority");
}

function setDefaultPriority() {
  const mediumButton = document.querySelector('button[data-priority="medium"]');
  mediumButton.classList.add("active");
  priority = "medium";
}

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

  function outsideClickListenerWrapper(event) {
    outsideClickListener(event, "category-dropdown-options", "category-dropdown-icon");
  }
}

function selectCategory(event, category) {
  const selectedCategory = document.getElementById("select-category");

  event.stopPropagation();

  const categoryOptions = document.querySelectorAll("#category-dropdown-options li");
  categoryOptions.forEach((option) => {
    option.classList.remove("selected");
  });

  selectedCategory.textContent = category;

  const currentOption = Array.from(categoryOptions).find((option) => option.textContent.trim() === category);
  if (currentOption) {
    currentOption.classList.add("selected");
  }

  toggleCategoryDropdown(event);
}

function validateTodoForm() {
  const titleField = document.getElementById("title") || document.getElementById("bc-todo-titel");
  const dueDateField = document.getElementById("due-date");
  const categoryField = document.getElementById("select-category");
  let isValid = true;
  clearWarnings();

  if (!titleField.value.trim()) {
    isValid = false;
    showWarning(titleField, "Title is required.");
  }

  if (!dueDateField.value) {
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

function openDatePicker(event) {
  event.stopPropagation();

  var dateInput = document.getElementById("due-date");
  dateInput.focus();
  dateInput.click();
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("due-date").value = "";
  document.getElementById("subtasks").value = "";
  document.getElementById("search").value = "";

  const selectedCategory = document.getElementById("select-category");
  selectedCategory.textContent = "Select task category";

  document.getElementById("selected-badges").innerHTML = "";

  const priorityButtons = document.querySelectorAll(".priority-actions button");
  priorityButtons.forEach((button) => button.classList.remove("active"));
  setDefaultPriority();

  const subtasksContainer = document.getElementById("subtask-list");
  if (subtasksContainer) {
    subtasksContainer.innerHTML = "";
  }

  const dropdownOptions = document.querySelectorAll("#contact-dropdown-options li");
  dropdownOptions.forEach((option) => {
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

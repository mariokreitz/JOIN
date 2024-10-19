/**
 * Initializes the page by loading the necessary components and rendering
 * the contact list.
 *
 * @returns {Promise<void>} A promise that resolves when the page has been
 * initialized.
 */
async function init() {
  loadComponents();
}

/**
 * Loads all necessary components into the page.
 *
 * Currently, this function only loads the header and navbar components.
 * @returns {void}
 */
function loadComponents() {
  loadHeader();
  loadNavbar();
}

/**
 * Loads the header component into the element with the id "header".
 * If no element with that id exists, this function does nothing.
 * @returns {void}
 */
function loadHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  header.innerHTML = getHeaderTemplate();
}

/**
 * Loads the navbar component into the element with the id "navbar".
 * If no element with that id exists, this function does nothing.
 *
 * @returns {void}
 */
function loadNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  navbar.innerHTML = getNavbarTemplate("add-task");
}

function handleButtonClick(event) {
  const buttons = document.querySelectorAll(".priority-actions button");
  const clickedButton = event.currentTarget;

  if (clickedButton.classList.contains("active")) {
    clickedButton.classList.remove("active");
    console.log("No priority selected");
  } else {
    buttons.forEach((button) => button.classList.remove("active"));
    clickedButton.classList.add("active");
    const activeButton = clickedButton.textContent.trim();
    console.log("Active priority:", activeButton);
  }
}

function handleInputChange() {
  const inputField = document.getElementById("subtasks");
  const addIcon = document.querySelector(".add-icon");
  const subtaskActions = document.querySelector(".subtask-actions");

  if (inputField.value.trim() !== "") {
    showSubtaskActions(addIcon, subtaskActions);
  } else {
    showAddIcon(addIcon, subtaskActions);
  }
}

function showSubtaskActions(addIcon, subtaskActions) {
  addIcon.style.display = "none";
  subtaskActions.style.display = "flex";
}

function showAddIcon(addIcon, subtaskActions) {
  addIcon.style.display = "block";
  subtaskActions.style.display = "none";
}

function clearInputField() {
  const inputField = document.getElementById("subtasks");
  inputField.value = "";
  inputField.dispatchEvent(new Event("input"));
}

function addSubtask(addIcon, subtaskActions) {
  const inputField = document.getElementById("subtasks");
  const subtaskText = inputField.value.trim();

  if (subtaskText !== "") {
    const subtaskList = document.getElementById("subtask-list");
    const subtaskItem = createSubtaskListItem(subtaskText);
    subtaskList.appendChild(subtaskItem);
    inputField.value = "";
  }
}

function removeSubtask(iconElement) {
  const listItem = iconElement.closest("li");
  if (listItem) {
    listItem.remove();
  }
}

function editSubtask(iconElement) {
  const listItem = iconElement.closest("li");
  const subtaskTextElement = listItem.querySelector(".subtask-text");
  const currentText = subtaskTextElement.textContent;
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.value = currentText;
  listItem.replaceChild(inputField, subtaskTextElement);
  const iconContainer = listItem.querySelector(".list-item-actions");
  iconContainer.innerHTML = getAcceptAndDeleteIconsTemplate();
}

function saveEdit(iconElement) {
  const listItem = iconElement.closest("li");
  const inputField = listItem.querySelector("input");
  const newText = inputField.value.trim();
  if (newText === "") {
    alert("Subtask cannot be empty!");
    return;
  }
  const subtaskTextElement = document.createElement("span");
  subtaskTextElement.className = "subtask-text";
  subtaskTextElement.textContent = newText;
  listItem.replaceChild(subtaskTextElement, inputField);
  const iconContainer = listItem.querySelector(".list-item-actions");
  iconContainer.innerHTML = getEditAndDeleteIconsTemplate();
}

function removeSubtask(iconElement) {
  const listItem = iconElement.closest("li");
  listItem.remove();
}

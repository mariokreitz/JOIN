/**
 * Initializes the page by loading components and rendering the contact list.
 * @returns {Promise<void>} A promise that resolves when the page has been initialized.
 */
async function init() {
  loadComponents();
  await getContactsFromData(API_URL, "guest");
  renderContactDropdown();
  const inputField = document.getElementById("subtasks");
  if (inputField) {
    inputField.addEventListener("input", handleSubtaskIcons);
  }
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

let selectedOptions = [];
let subTasks = {};
let priority = "";

function handlePrioChange(event) {
  const buttons = document.querySelectorAll(".priority-actions button");
  const clickedButton = event.currentTarget;

  buttons.forEach((button) => button.classList.remove("active"));
  clickedButton.classList.toggle("active");
  priority = clickedButton.classList.contains("active") ? clickedButton.getAttribute("data-priority") : "";
}

function handleSubtaskIcons() {
  const inputField = document.getElementById("subtasks");
  const addIcon = document.getElementById("add-icon");
  const subtaskActions = document.getElementById("subtask-actions");
  const isEmpty = inputField.value.trim() === "";

  toggleElementVisibility(addIcon, isEmpty);
  toggleElementVisibility(subtaskActions, !isEmpty);
}

function toggleElementVisibility(element, isVisible) {
  if (element) {
    element.style.display = isVisible ? "flex" : "none";
  }
}

function clearInputField() {
  const inputField = document.getElementById("subtasks");

  if (inputField) {
    inputField.value = "";
    inputField.dispatchEvent(new Event("input"));
  }
}

function checkScrollbar() {
  const subtaskList = document.getElementById("subtask-list");

  subtaskList.style.paddingRight = subtaskList.scrollHeight > subtaskList.clientHeight ? "10px" : "0";
}

function addSubtask() {
  const inputField = document.getElementById("subtasks");
  const subtaskText = inputField.value.trim();

  if (subtaskText) {
    const subtaskId = "SUBTODO" + Date.now();
    const subtaskItem = createSubtaskListItem(subtaskText, subtaskId);
    const subtaskList = document.getElementById("subtask-list");
    subtaskList.appendChild(subtaskItem);
    subTasks[subtaskId] = { state: false, text: subtaskText };
    clearInputField();
    checkScrollbar();
  }
}

function createSubtaskListItem(subtaskText, subtaskId) {
  const listItem = document.createElement("li");
  listItem.className = "subtask-item";
  listItem.setAttribute("data-id", subtaskId);
  listItem.innerText = subtaskText;
  return listItem;
}

function editSubtask(iconElement) {
  const listItem = iconElement.closest("li");
  const subtaskTextElement = listItem.querySelector(".subtask-text");
  const currentText = subtaskTextElement.textContent;
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.value = currentText;
  inputField.setAttribute("data-id", listItem.dataset.id);
  listItem.replaceChild(inputField, subtaskTextElement);
  const iconContainer = listItem.querySelector(".list-item-actions");
  iconContainer.innerHTML = getAcceptAndDeleteIconsTemplate();
}

function saveEdit(iconElement) {
  const listItem = iconElement.closest("li");
  const inputField = listItem.querySelector("input");
  const newText = inputField.value.trim();
  const subtaskId = inputField.getAttribute("data-id");

  if (subTasks[subtaskId]) {
    subTasks[subtaskId].text = newText;
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
  const subtaskId = listItem.getAttribute("data-id");

  if (subTasks[subtaskId]) {
    delete subTasks[subtaskId];
  }

  listItem.remove();
  checkScrollbar();
}

function renderContactDropdown() {
  const dropdownOptions = document.getElementById("dropdown-options");

  if (dropdownOptions) {
    const contactListHtml = generateContactListHtml(globalContacts);

    dropdownOptions.innerHTML = contactListHtml;
  }
}

function toggleDropdown() {
  const dropdown = document.getElementById("dropdown-options");
  const icon = document.getElementById("dropdown-icon");
  const isDropdownOpen = dropdown.classList.toggle("show");

  icon.classList.toggle("rotated");
  document[isDropdownOpen ? "addEventListener" : "removeEventListener"]("click", outsideClickListener);
}

function outsideClickListener(event) {
  const dropdown = document.getElementById("dropdown-options");
  const icon = document.getElementById("dropdown-icon");
  const input = document.getElementById("search");

  if (!dropdown.contains(event.target) && !icon.contains(event.target) && !input.contains(event.target)) {
    dropdown.classList.remove("show");
    icon.classList.remove("rotated");
    document.removeEventListener("click", outsideClickListener);
  }
}

function filterOptions() {
  const input = document.getElementById("search");
  const filter = input.value.toLowerCase();
  const ul = document.getElementById("dropdown-options");
  const li = ul.getElementsByTagName("li");

  ul.classList.add("show");

  for (let item of li) {
    const text = item.textContent || item.innerText;
    item.style.display = text.toLowerCase().includes(filter) ? "" : "none";
  }
}

function selectOption(option) {
  const checkbox = option.querySelector(".checkbox");
  const initials = option.querySelector(".badge").innerText.trim();
  const id = option.dataset.id;

  checkbox.checked = !checkbox.checked;
  option.classList.toggle("selected", checkbox.checked);
  checkbox.checked ? addBadge(id, initials, option.querySelector(".badge").style.backgroundColor) : removeBadge(id);
}

function addBadge(id, initials, color) {
  if (!selectedOptions.includes(id)) {
    selectedOptions.push(id);

    const badgeContainer = document.getElementById("selected-badges");
    const badge = document.createElement("div");

    badge.classList.add("selected-badge");
    badge.setAttribute("data-id", id);
    badge.style.backgroundColor = color;
    badge.innerHTML = `<span>${initials}</span>`;
    badgeContainer.appendChild(badge);
  }
}

function removeBadge(id) {
  selectedOptions = selectedOptions.filter((optionId) => optionId !== id);

  const badgeContainer = document.getElementById("selected-badges");
  const badge = badgeContainer.querySelector(`.selected-badge[data-id="${id}"]`);

  if (badge) badge.remove();
}

function removeOption(id) {
  const option = document.querySelector(`li[data-id="${id}"]`);

  if (option) {
    const checkbox = option.querySelector(".checkbox");
    checkbox.checked = false;
    option.classList.remove("selected");
  }

  removeBadge(id);
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("due-date").value = "";
  document.getElementById("subtasks").value = "";
  document.getElementById("category").value = "Select task category";
  document.getElementById("selected-badges").innerHTML = "";

  const priorityButtons = document.querySelectorAll(".priority-actions button");
  priorityButtons.forEach((button) => button.classList.remove("active"));

  const subtasksContainer = document.getElementById("subtask-list");
  if (subtasksContainer) {
    subtasksContainer.innerHTML = "";
  }

  const dropdownOptions = document.querySelectorAll("#dropdown-options li");
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

async function createTodo(user = "guest") {
  const id = "TODO" + Date.now();
  const assignedMembers = selectedOptions.map((id) => globalContacts[id].name);
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const dueDate = document.getElementById("due-date").value;
  const category = document.getElementById("category").value;

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
      createdAt: Date.now(),
      date: dueDate,
      description: description,
      priority: priority,
      state: "todo",
      subTasks: subTasksObject,
      title: title,
    },
  };

  console.log(todos);

  try {
    await updateTodosInFirebase(todos, user);
    console.log("Todo updated successfully for user:", user);
  } catch (error) {
    alert(`Failed to create a new task: ${error.message}`);
  }

  clearForm();
}

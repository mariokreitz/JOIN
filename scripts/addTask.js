/**
 * Initializes the page by loading the necessary components and rendering
 * the contact list.
 *
 * @returns {Promise<void>} A promise that resolves when the page has been
 * initialized.
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

let selectedOptions = [];
let subTasks = [];
let priority = "";

function handlePrioChange(event) {
  const buttons = document.querySelectorAll(".priority-actions button");
  const clickedButton = event.currentTarget;

  if (clickedButton.classList.contains("active")) {
    clickedButton.classList.remove("active");
    priority = "";
  } else {
    buttons.forEach((button) => button.classList.remove("active"));
    clickedButton.classList.add("active");
    priority = clickedButton.getAttribute("data-priority");
  }
}

function toggleElementVisibility(element, isVisible) {
  element.style.display = isVisible ? "flex" : "none";
}

function handleSubtaskIcons() {
  const inputField = document.getElementById("subtasks");
  const addIcon = document.getElementById("add-icon");
  const subtaskActions = document.getElementById("subtask-actions");

  if (inputField && addIcon && subtaskActions) {
    toggleElementVisibility(addIcon, inputField.value.trim() === "");
    toggleElementVisibility(subtaskActions, inputField.value.trim() !== "");
  }
}

function clearInputField() {
  const inputField = document.getElementById("subtasks");
  if (inputField) {
    inputField.value = "";
    inputField.dispatchEvent(new Event("input"));
  }
}

function addSubtask() {
  const inputField = document.getElementById("subtasks");
  const subtaskText = inputField.value.trim();

  if (subtaskText !== "") {
    const subtaskId = "SUBTODO" + Date.now();
    const subtaskList = document.getElementById("subtask-list");
    const subtaskItem = createSubtaskListItem(subtaskText, subtaskId);

    subtaskList.appendChild(subtaskItem);

    subTasks[subtaskId] = {
      state: false,
      text: subtaskText,
    };

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
  listItem.replaceChild(inputField, subtaskTextElement);
  const iconContainer = listItem.querySelector(".list-item-actions");
  iconContainer.innerHTML = getAcceptAndDeleteIconsTemplate();
  inputField.setAttribute("data-id", listItem.dataset.id);
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

function checkScrollbar() {
  const subtaskList = document.getElementById("subtask-list");
  subtaskList.style.paddingRight = subtaskList.scrollHeight > subtaskList.clientHeight ? "10px" : "0";
}

function renderContactDropdown() {
  const dropdownOptions = document.getElementById("dropdown-options");
  if (!dropdownOptions) return;

  const contactListHtml = generateContactListHtml(globalContacts);
  dropdownOptions.innerHTML = contactListHtml;
}

function toggleDropdown() {
  var dropdown = document.getElementById("dropdown-options");
  var icon = document.getElementById("dropdown-icon");
  var isDropdownOpen = dropdown.classList.toggle("show");
  icon.classList.toggle("rotated");

  if (isDropdownOpen) {
    document.addEventListener("click", outsideClickListener);
  } else {
    document.removeEventListener("click", outsideClickListener);
  }
}

function outsideClickListener(event) {
  var dropdown = document.getElementById("dropdown-options");
  var icon = document.getElementById("dropdown-icon");
  var input = document.getElementById("search");

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

  for (let i = 0; i < li.length; i++) {
    const text = li[i].textContent || li[i].innerText;
    li[i].style.display = text.toLowerCase().includes(filter) ? "" : "none";
  }
}

function selectOption(option) {
  var checkbox = option.querySelector(".checkbox");
  var initials = option.querySelector(".badge").innerText.trim();
  var id = option.dataset.id;
  checkbox.checked = !checkbox.checked;
  if (checkbox.checked) {
    option.classList.add("selected");
    addBadge(id, initials, option.querySelector(".badge").style.backgroundColor);
  } else {
    option.classList.remove("selected");
    removeBadge(id);
  }
}

function addBadge(id, initials, color) {
  if (!selectedOptions.includes(id)) {
    selectedOptions.push(id);
    var badgeContainer = document.getElementById("selected-badges");
    var badge = document.createElement("div");
    badge.classList.add("selected-badge");
    badge.setAttribute("data-id", id);
    badge.style.backgroundColor = color;
    badge.innerHTML = `<span>${initials}</span>`;
    badgeContainer.appendChild(badge);
  }
}

function removeBadge(id) {
  selectedOptions = selectedOptions.filter((optionId) => optionId !== id);
  var badgeContainer = document.getElementById("selected-badges");
  var badge = badgeContainer.querySelector(`.selected-badge[data-id="${id}"]`);

  if (badge) {
    badge.remove();
  }
}

function removeOption(id) {
  var option = document.querySelector(`li[data-id="${id}"]`);
  if (option) {
    var checkbox = option.querySelector(".checkbox");
    checkbox.checked = false;
    option.classList.remove("selected");
  }
  removeBadge(id);
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("due-date").value = "";
  document.getElementById("category").value = "Select task category";
  document.getElementById("selected-badges").innerHTML = "";
  document.getElementById("dropdown-options").innerHTML = "";

  selectedOptions = [];

  const priorityButtons = document.querySelectorAll(".priority-actions button");
  priorityButtons.forEach((priorityButtons) => priorityButtons.classList.remove("active"));
  priority = "";

  const subtasksContainer = document.getElementById("subtask-list");
  if (subtasksContainer) {
    subtasksContainer.innerHTML = "";
  }
  subTasks = [];
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

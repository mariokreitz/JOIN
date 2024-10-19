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
    checkScrollbar();
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
  checkScrollbar();
}

function checkScrollbar() {
  var subtaskList = document.getElementById("subtask-list");
  var isOverflowing = subtaskList.scrollHeight > subtaskList.clientHeight;

  if (isOverflowing) {
    subtaskList.style.paddingRight = "10px";
  } else {
    subtaskList.style.paddingRight = "0";
  }
}

function renderContactDropdown() {
  let index = -1;
  const dropdownOptions = document.getElementById("dropdown-options");
  if (!dropdownOptions) return;

  if (globalContacts.length === 0) {
    dropdownOptions.innerHTML = /*html*/ `
      <li class="no-contacts">
        <p>No contacts available to assign.</p>
      </li>
    `;
    return;
  }

  // globalContacts.sort((a, b) => a.name.localeCompare(b.name));

  const contactListHtml = globalContacts
    .map((contact) => {
      const initials = getInitialsFromContact(contact);
      index++;
      return /*html*/ `
        <li onclick="selectOption(this)" data-id="${index}">
          <span class="badge" style="background-color: ${contact.color}">${initials}</span>
          ${contact.name}
          <input type="checkbox" class="checkbox" />
        </li>
      `;
    })
    .join("");

  dropdownOptions.innerHTML = contactListHtml;
}

function getInitialsFromContact(contact) {
  const nameParts = contact.name.split(" ");
  const initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
  return initials;
}

function toggleDropdown() {
  var dropdown = document.getElementById("dropdown-options");
  var icon = document.getElementById("dropdown-icon");
  dropdown.classList.toggle("show");
  icon.classList.toggle("rotated");
}

function filterOptions() {
  var input = document.getElementById("search");
  var filter = input.value.toLowerCase();
  var ul = document.getElementById("dropdown-options");
  var li = ul.getElementsByTagName("li");

  ul.classList.add("show");

  for (var i = 0; i < li.length; i++) {
    var text = li[i].textContent || li[i].innerText;
    if (text.toLowerCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
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

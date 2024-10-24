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

/**
 * Loads the subtasks for a given todo item from the currentTodo object.
 * If the todo item does not have any subtasks, the function does nothing.
 * @param {Object} currentTodo - The todo item to load subtasks for.
 * @returns {void}
 */
function loadSubtasks(currentTodo) {
  if (!currentTodo.hasOwnProperty("subTasks")) return;

  const subtaskList = document.getElementById("subtask-list");
  if (!subtaskList) return;

  Object.keys(currentTodo.subTasks).forEach((key) => {
    const subtaskId = key;
    const subtaskText = currentTodo.subTasks[key].text;

    const subtaskItem = createSubtaskListItem(subtaskText, subtaskId);
    subtaskList.appendChild(subtaskItem);
  });
}

function createSubtaskListItem(subtaskText, subtaskId) {
  const li = document.createElement("li");
  li.innerHTML = subtaskListTemplate(subtaskText);
  li.setAttribute("data-id", subtaskId);
  li.addEventListener("dblclick", function () {
    editSubtask(li);
  });

  return li;
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

  if (!newText) {
    removeSubtask(iconElement);
    return;
  }

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

function clearInputField() {
  const inputField = document.getElementById("subtasks");
  if (inputField) {
    inputField.value = "";
    inputField.dispatchEvent(new Event("input"));
  }
}

function toggleSubtaskModalWrapper() {
  const subtaskModalWrapper = document.querySelector(".subtask-modal-wrapper");
  const bigCardSubtasksContainer = document.querySelector(".bigCard-subtasks-container");

  if (bigCardSubtasksContainer.children.length === 0) {
    subtaskModalWrapper.style.display = "none";
  } else {
    subtaskModalWrapper.style.display = "block";
  }
}

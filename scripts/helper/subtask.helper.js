/**
 * Updates the visibility of the add subtask icon and the subtask actions
 * depending on whether the input field is empty or not.
 */
function updateSubtaskIcons() {
  const inputField = document.getElementById("subtasks");
  const addIconElement = document.getElementById("add-icon");
  const subtaskActionsElement = document.getElementById("subtask-actions");
  const isEmpty = inputField.value.trim() === "";

  toggleElementVisibility(addIconElement, isEmpty);
  toggleElementVisibility(subtaskActionsElement, !isEmpty);
}

/**
 * Toggles the visibility of the given element based on the boolean value of
 * `isVisible`. If `isVisible` is true, sets the element's display style to
 * "flex". Otherwise, sets it to "none". Does nothing if the element is null or
 * undefined.
 *
 * @param {HTMLElement} element - The element to update
 * @param {boolean} isVisible - Whether the element should be visible or not
 */
function toggleElementVisibility(element, isVisible) {
  if (!element) return;

  element.style.display = isVisible ? "flex" : "none";
}

/**
 * Adds a new subtask to the subtask list if the input field contains text.
 * Generates a unique subtask ID, creates a new subtask list item, appends it
 * to the subtask list, and updates the global subTasks object with the new subtask.
 * Clears the input field and checks the need for scrollbar adjustments.
 */
function addSubtask() {
  const inputElement = document.getElementById("subtasks");
  const subtaskText = inputElement.value.trim();

  if (subtaskText) {
    const subtaskId = `SUBTODO_${Date.now()}`;
    const subtaskItem = createSubtaskListItem(subtaskText, subtaskId);
    const subtaskList = document.getElementById("subtask-list");
    subtaskList.appendChild(subtaskItem);
    subTasks[subtaskId] = { state: false, text: subtaskText };
    clearSubtaskInput();
    checkScrollbar();
  }
}

/**
 * Sets focus on the subtask input field, allowing the user to immediately start typing.
 * This function assumes that an element with the ID "subtasks" exists in the DOM.
 */
function focusSubtaskInput() {
  const subtaskInput = document.getElementById("subtasks");
  subtaskInput.focus();
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
    subTasks[subtaskId] = { state: currentTodo.subTasks[key].state, text: subtaskText };

    const subtaskItem = createSubtaskListItem(subtaskText, subtaskId);
    subtaskList.appendChild(subtaskItem);
  });
}

/**
 * Creates a new subtask list item with the given subtask text and ID.
 * The list item is given a double click event listener that calls the editSubtask function.
 * @param {string} subtaskText - The text of the subtask.
 * @param {string} subtaskId - The ID of the subtask.
 * @returns {HTMLLIElement} - The created subtask list item.
 */
function createSubtaskListItem(subtaskText, subtaskId) {
  const listItem = document.createElement("li");
  listItem.innerHTML = getSubtaskListItemTemplate(subtaskText);
  listItem.dataset.id = subtaskId;
  listItem.addEventListener("dblclick", () => editSubtask(listItem));

  return listItem;
}

/**
 * Starts an edit session on a subtask list item. The function is called when
 * the user double clicks on the text of a subtask list item. The function
 * creates a new text input element, sets its value to the current subtask text
 * and replaces the current subtask text element with the new input element.
 * The function also updates the icon container of the subtask list item to
 * include "accept" and "delete" icons.
 *
 * @param {HTMLElement} iconElement - The element that was double clicked to
 *   start the edit session. This element should be the "edit" icon of a subtask
 *   list item.
 * @returns {void}
 */
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

/**
 * Saves the current edit session of a subtask list item. The function is called
 * when the user clicks on the "accept" icon of a subtask list item. The function
 * checks if the current subtask text is empty and if so, removes the subtask
 * entirely. If the current subtask text is not empty, it updates the
 * corresponding subtask in the subTasks object and replaces the current input
 * element with a span element containing the updated text. The function also
 * updates the icon container of the subtask list item to contain the "edit" and
 * "delete" icons again.
 *
 * @param {HTMLElement} iconElement - The element that was clicked to save the
 *   edit session. This element should be the "accept" icon of a subtask list
 *   item.
 * @returns {void}
 */
function saveEdit(iconElement) {
  const listItem = iconElement.closest("li");
  const inputElement = listItem.querySelector("input");
  const updatedText = inputElement.value.trim();
  const subtaskId = inputElement.getAttribute("data-id");

  if (!updatedText) {
    removeSubtask(iconElement);
    return;
  }

  if (subTasks[subtaskId]) subTasks[subtaskId].text = updatedText;

  const subtaskTextSpan = document.createElement("span");
  subtaskTextSpan.className = "subtask-text";
  subtaskTextSpan.textContent = updatedText;
  listItem.replaceChild(subtaskTextSpan, inputElement);
  const iconsContainer = listItem.querySelector(".list-item-actions");
  iconsContainer.innerHTML = getEditAndDeleteIconsTemplate();
}

/**
 * Removes the subtask list item that the given icon element belongs to, and
 * also removes the corresponding entry from the subTasks object. The function
 * is called when the user clicks the "delete" icon of a subtask list item.
 * @param {HTMLElement} iconElement - The element that was clicked to remove
 *   the subtask. This element should be the "delete" icon of a subtask list
 *   item.
 * @returns {void}
 */
function removeSubtask(iconElement) {
  const subtaskListItem = iconElement.closest("li");
  const subtaskId = subtaskListItem.dataset.id;

  if (subTasks[subtaskId]) delete subTasks[subtaskId];

  subtaskListItem.remove();
  checkScrollbar();
}

/**
 * Clears the input field of the subtask list and triggers an input event on
 * it, so that the UI is updated correctly.
 *
 * This function is called when the user adds a subtask, to clear the input
 * field and be ready for the next subtask.
 *
 * @returns {void}
 */
function clearSubtaskInput() {
  const subtaskInput = document.getElementById("subtasks");
  if (subtaskInput) {
    subtaskInput.value = "";
    subtaskInput.dispatchEvent(new Event("input"));
  }
}

/**
 * Toggles the visibility of the subtask modal wrapper, based on whether the
 * subtasks container has any children or not.
 *
 * @returns {void}
 */
function toggleSubtaskModalWrapperVisibility() {
  const subtaskModalWrapper = document.querySelector(".subtask-modal-wrapper");
  const subtasksContainer = document.querySelector(".bigCard-subtasks-container");

  subtaskModalWrapper.style.display = subtasksContainer.children.length > 0 ? "block" : "none";
}

/**
 * Toggles the state of a subtask in the given todo.
 *
 * @param {number} index - The index of the todo in the globalTodos array.
 * @param {string} subtaskKey - The key of the subtask to be toggled.
 *
 * @returns {Promise<void>} - Resolves when the subtask state has been toggled.
 */
async function toggleSubtask(index, subTaskKey) {
  const currentTodo = globalTodos[index];
  const { subTasks = {} } = currentTodo;
  const subtask = subTasks[subTaskKey];

  subTasks[subTaskKey] = { ...subtask, state: !subtask?.state };
  const response = await updateTodosInFirebase("guest", arrayToObject(globalTodos));
  if (!response.ok) showToastMessage("error", response);
  globalTodos[index] = { ...currentTodo, subTasks };

  updateSubTasksDisplay(index, subTaskKey);
  triggerRender();
}

/**
 * Updates the display of the big task card modal with the todo item at the given index.
 * This is called when a subtask is checked or unchecked, and the big card modal needs
 * to be updated to reflect the change.
 *
 * @param {number} index - The index of the todo item in the globalTodos array
 * @returns {void}
 */
function updateSubTasksDisplay(index, subTaskKey) {
  const todoItem = globalTodos[index];
  const subTask = todoItem.subTasks[subTaskKey];
  const imgElement = document.getElementById(`subTaskImageChecked${subTaskKey}`);
  const isChecked = subTask.state === true ? "subtask-checked.svg" : "subtask-non-checked.svg";
  imgElement.src = `./assets/svg/${isChecked}`;
}

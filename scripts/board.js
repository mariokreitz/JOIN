/**
 * Destructures the columns from the DOM elements.
 *
 * @type {Object}
 * @property {HTMLElement} todoColumn - The todo column element.
 * @property {HTMLElement} progressColumn - The progress column element.
 * @property {HTMLElement} feedbackColumn - The feedback column element.
 * @property {HTMLElement} doneColumn - The done column element.
 */
let { todoColumn, progressColumn, feedbackColumn, doneColumn } = {};

/**
 * Initializes the board page by loading necessary components,
 * retrieving board columns from the DOM, fetching contacts and todos
 * from the Firebase database, and loading demo data.
 *
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function init() {
  loadComponents();
  getBoardColumnsFromDOM();
  await getContactsFromData("guest");
  await getTodosFromData("guest");
  initRender();
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
  navbar.innerHTML = getNavbarTemplate("board");
}

/**
 * Retrieves the column elements from the DOM and assigns them to the corresponding variables.
 * The todo, progress, feedback, and done column elements are obtained using their respective IDs.
 *
 * @returns {void}
 */
function getBoardColumnsFromDOM() {
  searchTodoRef = document.getElementById("search-task");
  ({ todoColumn, progressColumn, feedbackColumn, doneColumn } = getBoardColumns());
}

/**
 * Retrieves the column elements from the DOM by their IDs and returns them as an object.
 *
 * @returns {Object} An object containing references to the todo, progress, feedback, and done column elements.
 * @property {HTMLElement} todoColumn - The todo column element.
 * @property {HTMLElement} progressColumn - The progress column element.
 * @property {HTMLElement} feedbackColumn - The feedback column element.
 * @property {HTMLElement} doneColumn - The done column element.
 */
function getBoardColumns() {
  const todoColumn = document.getElementById("board-todo");
  const progressColumn = document.getElementById("board-progress");
  const feedbackColumn = document.getElementById("board-feedback");
  const doneColumn = document.getElementById("board-done");
  return { todoColumn, progressColumn, feedbackColumn, doneColumn };
}

/**
 * Initializes the rendering of the board page by rendering all todos
 * and placeholder elements. This function is called once, when the page
 * is loaded.
 *
 * @returns {void}
 */
function initRender() {
  renderTodos(globalTodos);
  renderAllPlaceholder();
}

/**
 * Renders a list of todos on the board by inserting the corresponding HTML elements
 * into the todo, progress, feedback, or done columns based on the state of each todo.
 * Additionally, this function sets the tooltip for the progress bar of each todo and
 * renders the assigned members for each todo.
 *
 * @param {Todo[]} todos The list of todos to be rendered.
 *
 * @returns {void}
 */
function renderTodos(todos) {
  if (!todoColumn || !progressColumn || !feedbackColumn || !doneColumn) return;
  todos.forEach((todo, index) => {
    const todoElement = getTaskCardSmallTemplate(index, todo);
    switch (todo.state) {
      case "todo":
        todoColumn.insertAdjacentHTML("beforeend", todoElement);
        setProgressBarTooltip(index, todo.subTasks);
        break;
      case "progress":
        progressColumn.insertAdjacentHTML("beforeend", todoElement);
        setProgressBarTooltip(index, todo.subTasks);
        break;
      case "feedback":
        feedbackColumn.insertAdjacentHTML("beforeend", todoElement);
        setProgressBarTooltip(index, todo.subTasks);
        break;
      case "done":
        doneColumn.insertAdjacentHTML("beforeend", todoElement);
        setProgressBarTooltip(index, todo.subTasks);
        break;
    }
    renderAssignedMembersForTodo(index, todo);
    addMobileMenu(index, todo);

    handleDragEvents();
  });
}

/**
 * Adds a dropdown menu to the bottom of the card for switching between todo states
 * on mobile devices. The menu shows all states except for the current one.
 *
 * @param {number} index The index of the todo in `globalTodos`.
 * @param {Todo} todo The todo object to be rendered.
 *
 * @returns {void}
 */
function addMobileMenu(index, todo) {
  const cardElement = document.getElementById(`card-switch-state-${index}`);
  const stateButtonElements = Object.entries(todoStates)
    .filter(([state]) => state !== todo.state)
    .map(([state, label]) => {
      const buttonElement = document.createElement("button");
      buttonElement.classList.add("inter-medium");
      buttonElement.textContent = label;
      buttonElement.onclick = (event) => {
        event.stopPropagation();
        updateTodoMobile(index, state);
      };
      return buttonElement;
    });
  cardElement.append(...stateButtonElements);
}

/**
 * Updates the state of a todo item in the global todos array and patches the updated todos object
 * in the Firebase Realtime Database. If the update is successful, a success toast message is shown
 * and the board is re-rendered. If there is an error, an error toast message is displayed.
 *
 * @param {number} index - The index of the todo item to update.
 * @param {string} newState - The new state to set for the todo item.
 * @returns {Promise<void>} - A promise that resolves when the update operation is complete.
 */
async function updateTodoMobile(index, newState) {
  const updatedTodos = [...globalTodos];
  updatedTodos[index].state = newState;

  try {
    const response = await updateTodosInFirebase("guest", arrayToObject(updatedTodos));

    if (response.ok) {
      showToastMessage("todoUpdated", response);
      triggerRender();
    } else showToastMessage("error", response);
  } catch (error) {
    showToastMessage("error", error);
  }
}

/**
 * Renders the assigned members for a specific todo item by creating and appending
 * HTML elements representing each assigned member to the DOM element corresponding
 * to the todo's assigned members section.
 *
 * If the assigned members element does not exist, the function returns immediately.
 *
 * @param {number} todoIndex - The index of the todo item.
 * @param {Object} todo - The todo object containing the assigned members information.
 * @returns {void}
 */
function renderAssignedMembersForTodo(todoIndex, todo) {
  const assignedMembersElement = document.getElementById(`assigned-members-${todoIndex}`);

  if (!assignedMembersElement) return;

  const assignedMembers = objectToArray(todo.assignedMembers);

  assignedMembersElement.append(
    ...assignedMembers.map((memberName, memberIndex) => {
      const contact = globalContacts.find((contact) => contact.name === memberName);
      return createAssignedMemberElement(contact, memberIndex, assignedMembers.length);
    })
  );
}

/**
 * Creates an HTML element representing an assigned member badge.
 *
 * @param {Object} contact - The contact object containing information about the assigned member.
 * @param {number} index - The index of the member in the assigned members list.
 * @param {number} totalMembers - The total number of assigned members.
 * @returns {HTMLElement|string} The HTML element representing the member badge or an empty string if the index is greater than 3.
 */
function createAssignedMemberElement(contact, index, totalMembers) {
  const memberElement = document.createElement("div");
  memberElement.classList.add("card-mall-assigend-member-badge");

  if (index < 3 && contact) {
    memberElement.textContent = getInitialsFromContact(contact);
    memberElement.style.backgroundColor = contact.color;
  } else if (index === 3) {
    memberElement.textContent = `+${totalMembers - 3}`;
    memberElement.style.backgroundColor = "#c7c7c7";
  } else return "";

  return memberElement;
}

/**
 * Attaches event listeners to each todo item to set its cursor style based on whether the left mouse button is being
 * pressed or not. This is necessary because the CSS `:active` pseudo-class does not work when the element is being
 * dragged.
 *
 * @returns {void}
 */
function handleDragEvents() {
  document.querySelectorAll(".task-card-small").forEach((element) => {
    element.addEventListener("mousedown", (event) => {
      if (event.button === 0) {
        element.style.cursor = "grab";
      }
    });
    element.addEventListener("mouseup", (event) => {
      if (event.button === 0) {
        element.style.cursor = "pointer";
      }
    });
  });
}

/**
 * Renders all placeholder elements on the board, including the regular placeholder and the hollow drag area placeholder.
 */
function renderAllPlaceholder() {
  renderPlaceholder();
  renderHollowPlaceholder();
}

/**
 * Renders a placeholder element in each column if the column is empty.
 *
 * @returns {void}
 */
function renderPlaceholder() {
  if (!todoColumn || !progressColumn || !feedbackColumn || !doneColumn) return;
  const columns = [todoColumn, progressColumn, feedbackColumn, doneColumn];
  columns.forEach((column) => {
    if (!column.innerHTML) {
      column.insertAdjacentHTML(
        "beforeend",
        /*html*/ `
        <div class="board-column-placeholder inter-extralight">
          <p>${getPlaceholderText(column)}</p>
        </div>`
      );
    }
  });
}

/**
 * Renders a hollow drag area placeholder in each column, which is used to
 * indicate a place where a task card can be dragged to.
 *
 * @returns {void}
 */
function renderHollowPlaceholder() {
  if (!todoColumn || !progressColumn || !feedbackColumn || !doneColumn) return;
  const columns = [todoColumn, progressColumn, feedbackColumn, doneColumn];
  columns.forEach((column) => column.insertAdjacentHTML("beforeend", getDragAreaHollowPlaceholder()));
}

/**
 * Handles the search bar input event.
 *
 * When the user types in the search bar, this function
 * filters the list of todos by the search term. If the search term is empty,
 * the function clears the board columns and renders all todos. Otherwise, it
 * clears the board columns and renders only the filtered todos.
 *
 * @param {Event} event The input event from the search bar.
 * @returns {void}
 */
function searchTodos(event) {
  const {
    key,
    target: { value: searchTerm },
  } = event;

  if (key === "Enter") return;

  const filteredTodos = globalTodos.filter(({ title, description }) =>
    [title, description].some((text) => text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (searchTerm === "") {
    clearBoardColumns();
    renderTodos(globalTodos);
    renderPlaceholder();
    renderHollowPlaceholder();
  } else {
    clearBoardColumns();
    renderTodos(filteredTodos);
    renderPlaceholder();
    renderHollowPlaceholder();
  }
}

/**
 * Opens the state change menu for a specific todo card, allowing the user to select a new state
 * for the todo. The menu is anchored to the todo card and remains open until a click outside the
 * menu is detected. Once an outside click is detected, the menu is closed and the original
 * onclick event for the todo card is restored.
 *
 * @param {Event} event - The event object from the click event that triggered the menu opening.
 * @param {number} todoIndex - The index of the todo card for which the state change menu should be opened.
 * @returns {void}
 */
function openStateChangeMenu(event, todoIndex) {
  event.stopPropagation();

  const stateChangeMenu = document.getElementById(`card-switch-state-${todoIndex}`);
  stateChangeMenu.classList.remove("d_none");

  const todoCard = document.getElementById(`task-card-small-${todoIndex}`);
  todoCard.onclick = null;

  /**
   * Handles an outside click event by closing the state change menu, removing the
   * outside click event listener, and restoring the original onclick event for the
   * todo card.
   *
   * @param {{ target: HTMLElement }} event - The event object from the click event
   * @returns {void}
   */
  const handleOutsideClick = ({ target }) => {
    if (!stateChangeMenu.contains(target)) {
      stateChangeMenu.classList.add("d_none");
      document.removeEventListener("click", handleOutsideClick);
      todoCard.onclick = () => openTodoModal(todoIndex);
    }
  };

  document.addEventListener("click", handleOutsideClick);
}

/**
 * Handles the drop event of a todo card being dragged to a new column.
 *
 * Calls updateTodo to update the state of the todo in the global todos array
 * and patches the todos object in the Firebase Realtime Database.
 *
 * Then, it clears all columns on the board and renders all todos again. Finally,
 * it calls renderAllPlaceholder to render all placeholder elements and
 * removeAllHighlights to remove any highlights from the board.
 *
 * @param {string} state - The new state of the todo.
 * @returns {void}
 */
function onDrop(state) {
  updateTodo(state);
  triggerRender();
  removeAllHighlights();
}

/**
 * Updates a todo in the global todos array and patches the todos object in the Firebase Realtime Database.
 *
 * @param {string} state - The new state of the todo.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
async function updateTodo(state) {
  globalTodos[currentlyDraggedElement].state = state;
  const todosObject = arrayToObject(globalTodos);
  const response = await updateTodosInFirebase("guest", todosObject);

  if (response.status === 400) {
    showToastMessage("error", response);
  }
}

/**
 * Triggers the rendering of the entire board by clearing the columns, rendering all
 * todo items and rendering all placeholder elements.
 *
 * @returns {void}
 */
function triggerRender() {
  clearBoardColumns();
  renderTodos(globalTodos);
  renderAllPlaceholder();
}

/**
 * Deletes the todo at the specified index from the global todos array and
 * from the Firebase Realtime Database. If the deletion is successful, a
 * toast message is shown. Otherwise, an error is logged to the console.
 *
 * @param {number} index - The index of the todo to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the deletion is complete.
 */
async function deleteTodo(index) {
  const todo = globalTodos[index];

  if (!todo) return;

  const todoID = `TODO${todo.createdAt}`;
  const response = await deleteTodosInFirebase("guest", todoID);
  globalTodos.splice(index, 1);

  if (response.ok) showToastMessage("todoDeleted", response);
  else showToastMessage("error", response);
}

/**
 * Clears all task cards from all columns on the board.
 *
 * This function is called whenever the user searches for a task, in order to clear the
 * board and then render only the found tasks.
 *
 * @returns {void}
 */
function clearBoardColumns() {
  todoColumn.innerHTML = "";
  progressColumn.innerHTML = "";
  feedbackColumn.innerHTML = "";
  doneColumn.innerHTML = "";
}

/**
 * Sets the currently dragged element to the given todoId and adds the "dragging"
 * class to the corresponding task card element.
 *
 * @param {number} todoId - The ID of the todo element that is being dragged.
 * @returns {void}
 */
function startDraggingTodo(todoId) {
  currentlyDraggedElement = todoId;
  const todoCardElement = document.getElementById(`task-card-small-${todoId}`);

  if (!todoCardElement) return;

  todoCardElement.classList.add("dragging");

  document.addEventListener(
    "dragend",
    () => {
      todoCardElement.classList.remove("dragging");
      document.body.style.cursor = "";
    },
    { once: true }
  );
}

/**
 * Allows an element to be dropped by preventing the default behavior.
 *
 * This function is used as an event handler for the `ondragover` event,
 * enabling drag-and-drop functionality on an element.
 *
 * @param {Event} event - The dragover event object.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Highlights the drag area element identified by the given elementId by adding
 * the "drag-area" class to it. Also toggles the placeholder element for the
 * given elementId. If the element is already highlighted or does not exist,
 * the function does nothing.
 *
 * @param {string} elementId - The id of the drag area element to highlight.
 */
function addDragAreaHighlighting(elementId) {
  const dragAreaElement = document.getElementById(elementId);

  if (!dragAreaElement || currentTarget === dragAreaElement) return;

  dragAreaElement.classList.add("drag-area");
  togglePlaceholder(elementId);
  addHollowPlaceholder(elementId);
  currentTarget = dragAreaElement;
}

/**
 * Removes the highlighting from the drag area element with the given elementId
 * by removing the "drag-area" class from it. Also toggles the placeholder
 * element for the given elementId. If the element is already highlighted or
 * does not exist, the function does nothing.
 * @param {string} elementId - The id of the drag area element to remove highlighting from.
 */
function removeDragAreaHighlighting(elementId) {
  const dragAreaElement = document.getElementById(elementId);

  if (!dragAreaElement) return;

  dragAreaElement.classList.remove("drag-area");
  togglePlaceholder(elementId);
  removeHollowPlaceholder(elementId);
  currentTarget = null;
}
/**
 * Removes the "drag-area" class from all elements, effectively removing
 * the highlighting from all drag areas on the board.
 *
 * @returns {void}
 */
function removeAllHighlights() {
  const dragAreas = document.querySelectorAll(".drag-area");
  if (!dragAreas) return;
  dragAreas.forEach((dragArea) => dragArea.classList.remove("drag-area"));
}

/**
 * Opens the big card modal in view mode for the todo item at the given index.
 * This will populate the big card modal with the todo item's information and
 * make the modal visible.
 *
 * @param {number} index - The index of the todo item in the globalTodos array
 * @returns {void}
 */
function openTodoModal(index, isFromEdit = false) {
  const currentTodo = globalTodos[index];
  const renderContainer = document.getElementById("big-card-modal-background");
  renderContainer.innerHTML = getTaskCardBigTemplate(currentTodo, index);
  const bigCardModalBackground = document.getElementById("big-card-modal-background");
  bigCardModalBackground.classList.remove("d_none");
  document.body.style.overflow = "hidden";

  if (!isFromEdit) applyCardAnimation("slide-in");
  checkScrollbar();
  toggleSubtaskModalWrapperVisibility();
  selectedOptions.length = 0;
}

function applyCardAnimation(animationType) {
  const modalContent = document.getElementById("big-card-modal") || document.getElementById("closeEditContainer");
  modalContent.style.animation = `${animationType} 0.3s ease-out forwards`;
}

/**
 * Opens the big card modal in edit view for the todo item at the given index.
 * This will populate the big card modal with the todo item's information and
 * highlight the currently selected priority.
 *
 * @param {number} index - The index of the todo item in the globalTodos array
 * @returns {void}
 */
function openTodoModalEdit(index) {
  const currentTodo = globalTodos[index];
  const renderContainer = document.getElementById("big-card-modal-background");
  renderContainer.innerHTML = getTaskCardBigEditTemplate(currentTodo, index);

  const prioritySelects = document.querySelectorAll(".bc-prio-select");

  prioritySelects.forEach((select) => select.classList.remove("active"));

  switch (currentTodo.priority) {
    case "high":
      document.getElementById("bc-select-urgent").classList.add("active");
      break;
    case "medium":
      document.getElementById("bc-select-medium").classList.add("active");
      break;
    case "low":
      document.getElementById("bc-select-low").classList.add("active");
      break;
    default:
      break;
  }
  restrictPastDatePick();
  renderContactDropdown(currentTodo.assignedMembers);
  loadSubtasks(currentTodo);
  initializeBadges();
  checkScrollbar();
}

/**
 * Toggles the big card modal's visibility and animation based on the overflow state
 * of the body. If the body is set to "hidden", the big card modal is displayed and
 * the body is set to "auto", otherwise the big card modal is hidden and the body
 * is set to "hidden".
 *
 * @param {number} index - The index of the todo item in the globalTodos array
 * @returns {void}
 */
function toggleTodoModal(index) {
  checkScrollbar();
  document.body.style.overflow = document.body.style.overflow === "hidden" ? "auto" : "hidden";
  const bigCardModalBackground = document.getElementById("big-card-modal-background");
  if (!bigCardModalBackground) return;
  const closeEditContainer = bigCardModalBackground.querySelector("#closeEditContainer");
  if (closeEditContainer) {
    openTodoModal(index);
  } else {
    applyCardAnimation("slide-out");
    setTimeout(() => {
      bigCardModalBackground.classList.toggle("d_none");
    }, 300);
  }
}

/**
 * Returns the color of the assigned member specified by the given name.
 *
 * @param {string} assignedMemberName - The name of the assigned member.
 * @returns {string|undefined} The color of the assigned member or undefined if no contact with the given name is found.
 */
function getAssignedMemberColor(assignedMemberName) {
  const contact = globalContacts.find((contact) => contact.name === assignedMemberName);
  return contact ? contact.color : undefined;
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

/**
 * Saves the changes made to a todo item in the big card modal and updates the
 * corresponding element in the globalTodos array. After saving the changes, the
 * big card modal is closed and the board is re-rendered.
 *
 * @param {number} index - The index of the todo item in the globalTodos array
 * @returns {Promise<void>} - Resolves when the save operation is complete
 */
async function saveEditedTodo(index) {
  const todo = globalTodos[index];
  if (!todo) return;

  const { title, description, dueDate, selectedPriority, assignedMembers } = getFormData(
    "bc-select-urgent",
    "bc-select-medium",
    "bc-select-low",
    "bc-todo-titel",
    "bc-description-textarea",
    "due-date"
  );

  if (!validateTodoForm()) return;

  Object.assign(todo, { title, description, date: dueDate, priority: selectedPriority, subTasks, assignedMembers });

  try {
    const response = await updateTodosInFirebase("guest", arrayToObject(globalTodos));
    const messageType = response.ok ? "todoUpdated" : "error";
    showToastMessage(messageType, response);
  } catch (error) {
    showToastMessage("error", error);
  }

  openTodoModal(index, true);
  triggerRender();
  selectedOptions.length = 0;
  subTasks = {};
}

/**
 * Deletes a task card from the board and updates the UI.
 *
 * This function deletes a task card at the specified index from the global todos array,
 * closes the task card modal, clears all columns on the board, and re-renders
 * the remaining todos and placeholder elements.
 *
 * @param {number} index - The index of the task card to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the deletion and UI update are complete.
 */
async function deleteTaskCard(index) {
  await deleteTodo(index);
  toggleTodoModal(index);
  triggerRender();
}

/**
 * Toggles the visibility of the placeholder element within the specified column.
 *
 * @param {string} elementId - The ID of the column element in which to toggle the placeholder.
 */
function togglePlaceholder(elementId) {
  const element = document.getElementById(elementId);
  const placeholder = element.querySelector(".board-column-placeholder");
  if (!placeholder) return;
  placeholder.classList.toggle("d_none");
}

/**
 * Makes the hollow rag area placeholder within the specified column
 * visible by removing the "d_none" class from it.
 *
 * @param {string} elementId - The ID of the column element in which to show the hollow placeholder.
 */
function addHollowPlaceholder(elementId) {
  const element = document.getElementById(elementId);
  const placeholder = element.querySelector(".drag-area-hollow-placeholder");
  if (!placeholder) return;
  placeholder.classList.remove("d_none");
}

/**
 * Hides the hollow drag area placeholder within the specified column
 * by adding the "d_none" class to it.
 *
 * @param {string} elementId - The ID of the column element in which to hide the hollow placeholder.
 */
function removeHollowPlaceholder(elementId) {
  const element = document.getElementById(elementId);
  const placeholder = element.querySelector(".drag-area-hollow-placeholder");
  if (!placeholder) return;
  placeholder.classList.add("d_none");
}

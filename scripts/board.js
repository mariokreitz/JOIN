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

  if (searchTerm === "") renderSpecificTodos(globalTodos);
  else renderSpecificTodos(filteredTodos);
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
  const todoCard = document.getElementById(`task-card-small-${todoIndex}`);
  const profileMenu = document.getElementById("profile-menu");

  if (profileMenu && !profileMenu.classList.contains("d_none")) profileMenu.classList.add("d_none");
  if (currentlyOpenMenu && currentlyOpenMenu !== stateChangeMenu) currentlyOpenMenu.classList.add("d_none");

  stateChangeMenu.classList.toggle("d_none");
  currentlyOpenMenu = stateChangeMenu.classList.contains("d_none") ? null : stateChangeMenu;
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
      currentlyOpenMenu = null;
    }
  };
  document.addEventListener("click", handleOutsideClick);
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
  if (response.status === 400) showToastMessage("error", response);
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

/**
 * Applies the given animation to the big card modal content element.
 *
 * @param {string} animationType - The type of animation to apply.
 */
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
  if (closeEditContainer) openTodoModal(index);
  else {
    applyCardAnimation("slide-out");
    setTimeout(() => {
      bigCardModalBackground.classList.toggle("d_none");
    }, 300);
  }
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

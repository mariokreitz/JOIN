/**
 * Reference to the search task input element.
 *
 * @type {HTMLInputElement}
 */
let searchTaskRef;

/**
 * Reference to the currently dragged element.
 *
 * @type {number}
 */
let currentlyDraggedElement;

/**
 * The current target element being interacted with, used to determine
 * whether to highlight a drag area or not.
 *
 * @type {HTMLElement|null}
 */
let currentTarget = null;

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
  loadDemoData();
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
  searchTaskRef = document.getElementById("search-task");
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
 * Loads demo data by rendering the global list of todos onto the board.
 *
 * @returns {void}
 */
async function loadDemoData() {
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
    renderAssignedMembers(index, todo);
    handleDragEvents();
  });
}

/**
 * Given the index and todo object, renders the assigned members of the todo
 * card element at that index. The assigned members are retrieved from the
 * todo object and rendered as individual contact items using the
 * getAssignedMemberTemplate function.
 *
 * @param {number} index - The index of the todo element to render the assigned
 *   members for.
 * @param {Object} todo - The todo object containing the assigned members.
 * @returns {void}
 */
function renderAssignedMembers(index, todo) {
  const assignedMembersElement = document.getElementById(`assigned-members-${index}`);
  if (!assignedMembersElement) return;

  const assignedMembersArr = objectToArray(todo.assignedMembers);

  assignedMembersArr.forEach((member) => {
    const foundMember = globalContacts.find((contact) => contact.name === member);
    if (foundMember) {
      const initials = getInitialsFromContact(foundMember);
      assignedMembersElement.insertAdjacentHTML("beforeend", getAssignedMemberTemplate(foundMember.color, initials));
    } else {
      assignedMembersElement.insertAdjacentHTML("beforeend", getAssignedMemberTemplate("#c7c7c7"));
    }
  });
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
  clearBoardColumns();
  renderTodos(globalTodos);
  renderAllPlaceholder();
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

function toggleCardModal() {
  const modalBackground = document.getElementById("big-card-modal-background");
  modalBackground.classList.toggle("d_none");
}

function updateSubTasksDisplay(index) {
  const todo = globalTodos[index];
  const renderC = document.getElementById("big-card-modal-background");

  renderC.innerHTML = "";
  renderC.innerHTML += getTaskCardBigTemplate(todo, index);
}

function bigCard(index) {
  const todo = globalTodos[index];
  const renderC = document.getElementById("big-card-modal-background");

  renderC.innerHTML = "";
  renderC.innerHTML += getTaskCardBigTemplate(todo, index);
  toggleCardModal();
}

function openBigCardModalEdit(index) {
  const todo = globalTodos[index];
  const renderC = document.getElementById("big-card-modal-background");
  renderC.innerHTML = "";
  renderC.innerHTML += getTaskCardBigEdit(todo, index);

  const currentTodo = globalTodos[index];
  document.getElementById("bc-select-urgent").classList.remove("active");
  document.getElementById("bc-select-medium").classList.remove("active");
  document.getElementById("bc-select-low").classList.remove("active");

  if (currentTodo.priority === "high") {
    document.getElementById("bc-select-urgent").classList.add("active");
  } else if (currentTodo.priority === "medium") {
    document.getElementById("bc-select-medium").classList.add("active");
  } else if (currentTodo.priority === "low") {
    document.getElementById("bc-select-low").classList.add("active");
  }
}

function closeBigCardEdit() {
  toggleCardModal();
}

function closeTaskCardBig() {
  toggleCardModal();
}

function getAssignedMemberColor(assignedMemberName) {
  const contact = globalContacts.find((contact) => contact.name === assignedMemberName);
  return contact ? contact.color : undefined;
}

async function doneSubTask(index, subTaskKey) {
  const currentTodo = globalTodos[index];

  if (!currentTodo.subTasks) return;

  const subTask = currentTodo.subTasks[subTaskKey];
  if (subTask) {
    subTask.state = !subTask.state;
  }

  const todosObject = arrayToObject(globalTodos);
  const response = await updateTodosInFirebase("guest", todosObject);

  if (response.ok) {
    console.log("aktualisiert");
    updateSubTasksDisplay(index);
  } else {
    console.error("Fehler", response);
  }
}

async function editBigCard(index) {
  const currentTodo = globalTodos[index];

  if (!currentTodo) {
    console.error(`Todo mit Index ${index} nicht gefunden.`);
    return;
  }

  const isUrgentSelected = document.getElementById("bc-select-urgent").classList.contains("active");
  const isMediumSelected = document.getElementById("bc-select-medium").classList.contains("active");
  const isLowSelected = document.getElementById("bc-select-low").classList.contains("active");

  if (isUrgentSelected) {
    currentTodo.priority = "high";
  } else if (isMediumSelected) {
    currentTodo.priority = "medium";
  } else if (isLowSelected) {
    currentTodo.priority = "low";
  } else {
    console.error("Keine Priorität ausgewählt");
    return;
  }

  const newTitle = document.getElementById("bc-todo-titel").value;
  const newDescription = document.getElementById("bc-description-textarea").value;
  const newDueDate = document.getElementById("bc-duedate-input").value;

  if (!newTitle || !newDescription || !newDueDate) {
    console.error("Eingaben sind ungültig oder leer.");
    return;
  }

  currentTodo.title = newTitle;
  currentTodo.description = newDescription;
  currentTodo.date = newDueDate;

  const todosObject = arrayToObject(globalTodos);
  const response = await updateTodosInFirebase("guest", todosObject);

  if (response.ok) {
    console.log("Todo erfolgreich aktualisiert");
  } else {
    console.error("Fehler beim Aktualisieren", response);
  }
}

async function deleteTaskCard(index) {
  const currentTodo = globalTodos[index];

  if (!currentTodo) {
    console.error(`${index} nicht gefunden.`);
    return;
  }

  const todoID = `TODO${currentTodo.createdAt}`;

  const response = await deleteTodosInFirebase("guest", todoID);

  if (response.ok) {
    console.log("erfolgreich gelöscht");
  } else {
    console.error("Fehler", response);
  }
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
 * Makes the hollow drag area placeholder within the specified column
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

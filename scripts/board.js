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
  await getContactsFromData(API_URL, "guest");
  await getTodosFromData(API_URL, "guest");
  loadDemoData();
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
  } else {
    clearBoardColumns();
    renderTodos(filteredTodos);
    renderPlaceholder();
  }
}

/**
 * Loads demo data by rendering the global list of todos onto the board.
 *
 * @returns {void}
 */
async function loadDemoData() {
  renderTodos(globalTodos);
  renderPlaceholder();
}

/**
 * Renders a list of todo items into their respective columns based on their state.
 *
 * @param {Array<Object>} todos - An array of todo objects to be rendered. Each todo
 *                                object should contain a `state` property indicating
 *                                its current status, such as "todo", "progress",
 *                                "feedback", or "done".
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
          <p>No tasks To do</p>
        </div>`
      );
    }
  });
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
 * Called when a task card is dragged.
 *
 * Sets the currentlyDraggedElement variable to the id of the dragged element.
 *
 * @param {number} id The id of the dragged element.
 * @returns {void}
 */
function onDragStart(id) {
  currentlyDraggedElement = id;
}

function onDrop(state) {
  updateTodo(state);
  clearBoardColumns();
  renderTodos(globalTodos);
  renderPlaceholder();
  removeDragAreaHighlighting();
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
 * Updates a todo in the global todos array and patches the todos object in the Firebase Realtime Database.
 *
 * @param {string} state - The new state of the todo.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
async function updateTodo(state) {
  globalTodos[currentlyDraggedElement].state = state;
  const todosObject = arrayToObject(globalTodos);
  const response = await updateTodosInFirebase(todosObject, "guest");

  if (response.status === 400) {
    showToastMessage("error", response);
  }
}

function addDragAreaHighlight(elementId) {
  const element = document.getElementById(elementId);
  element.classList.add("drag-area");
}

function removeDragAreaHighlighting() {
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
  const response = await updateTodosInFirebase(todosObject, "guest");

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
  const response = await updateTodosInFirebase(todosObject, "guest");

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

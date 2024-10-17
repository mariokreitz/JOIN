/**
 * Reference to the search task input element.
 *
 * @type {HTMLInputElement}
 */
let searchTaskRef;

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
  } else {
    clearBoardColumns();
    renderTodos(filteredTodos);
  }
}

/**
 * Loads demo data by rendering the global list of todos onto the board.
 *
 * @returns {void}
 */
async function loadDemoData() {
  renderTodos(globalTodos);
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
    const initials = getInitialsFromContact({ name: member });
    const foundMember = globalContacts.find((contact) => contact.name === member);

    assignedMembersElement.insertAdjacentHTML("beforeend", getAssignedMemberTemplate(initials, foundMember.color));
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

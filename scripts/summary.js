/**
 * Initializes the page by loading the necessary components and rendering
 * the contact list.
 *
 * @returns {Promise<void>} A promise that resolves when the page has been
 * initialized.
 */
async function init() {
  loadComponents();
  await getTodosFromData("guest");
  populateCounters(globalTodos);
  updateGreeting();
  showGreeting();
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
  navbar.innerHTML = getNavbarTemplate("summary");
}

/**
 * Populates the DOM elements with counts of different types of todos and user information.
 *
 * @param {Array} todos - An array of todo objects, each containing state, priority, and other properties.
 */
function populateCounters(todos) {
  document.getElementById("todo-count").textContent = countTodos(todos, "todo");
  document.getElementById("done-count").textContent = countTodos(todos, "done");
  document.getElementById("progress-count").textContent = countTodos(todos, "progress");
  document.getElementById("feedback-count").textContent = countTodos(todos, "feedback");
  document.getElementById("urgent-count").textContent = countUrgentTodos(todos);
  document.getElementById("total-count").textContent = todos.length;
  document.getElementById("name").textContent = currentUser.name;
  document.getElementById("due-date").textContent =
    findEarliestDeadline(todos) !== "No urgent tasks"
      ? findEarliestDeadline(todos).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : findEarliestDeadline(todos);
}

/**
 * Counts the number of todos in a specific state.
 *
 * @param {Array} todos - An array of todo objects.
 * @param {string} state - The state of the todos to count (e.g., "todo", "done").
 * @returns {number} The count of todos in the specified state.
 */
function countTodos(todos, state) {
  return todos.filter((todo) => todo.state === state).length;
}

/**
 * Counts the number of urgent todos that are not marked as done.
 *
 * @param {Array} todos - An array of todo objects.
 * @returns {number} The count of urgent todos (high priority) that are not done.
 */
function countUrgentTodos(todos) {
  return todos.filter((todo) => todo.priority === "high" && todo.state !== "done").length;
}

/**
 * Finds the earliest deadline among urgent todos that are not marked as done.
 *
 * @param {Array} todos - An array of todo objects.
 * @returns {Date|string} The earliest deadline as a Date object, or a message if there are no urgent tasks.
 */
function findEarliestDeadline(todos) {
  const urgentTasks = todos.filter((todo) => todo.priority === "high" && todo.state !== "done");
  return urgentTasks.length > 0
    ? urgentTasks.reduce((earliest, todo) => {
        const todoDate = new Date(todo.date);
        return todoDate < earliest ? todoDate : earliest;
      }, new Date(urgentTasks[0].date))
    : "No urgent tasks";
}

/**
 * Updates the greeting message based on the current time of day.
 */
function updateGreeting() {
  const greetingElement = document.getElementById("greeting");
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  let greeting;
  if (currentHour < 12) {
    greeting = "Good morning,";
  } else if (currentHour < 18) {
    greeting = "Good afternoon,";
  } else {
    greeting = "Good evening,";
  }
  greetingElement.textContent = greeting;
}

function showGreeting() {
  const greetingContainer = document.getElementById("greeting-container");
  if (window.innerWidth < 768) {
    greetingContainer.classList.add("show");
    setTimeout(() => {
      greetingContainer.classList.add("fade-out");
      setTimeout(() => {
        greetingContainer.style.display = "none";
        document.body.style.overflow = "";
      }, 300);
    }, 2000);
    document.body.style.overflow = "hidden";
  }
}

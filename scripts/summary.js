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

function countTodos(todos, state) {
  return todos.filter((todo) => todo.state === state).length;
}

function countUrgentTodos(todos) {
  return todos.filter((todo) => todo.priority === "high" && todo.state !== "done").length;
}

function findEarliestDeadline(todos) {
  const urgentTasks = todos.filter((todo) => todo.priority === "high" && todo.state !== "done");
  return urgentTasks.length > 0
    ? urgentTasks.reduce((earliest, todo) => {
        const todoDate = new Date(todo.date);
        return todoDate < earliest ? todoDate : earliest;
      }, new Date(urgentTasks[0].date))
    : "No urgent tasks";
}

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

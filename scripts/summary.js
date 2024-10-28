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
  const todoCount = todos.filter((todo) => todo.state === "todo").length;
  const doneCount = todos.filter((todo) => todo.state === "done").length;
  const progressCount = todos.filter((todo) => todo.state === "progress").length;
  const feedbackCount = todos.filter((todo) => todo.state === "feedback").length;
  const urgentCount = todos.filter((todo) => todo.priority === "high").length;
  const totalCount = todos.length;
  const upcomingDeadline = todos.reduce((earliest, todo) => {
    const todoDate = new Date(todo.date);
    return todoDate < earliest ? todoDate : earliest;
  }, new Date(todos[0].date));

  document.getElementById("todo-count").textContent = todoCount;
  document.getElementById("done-count").textContent = doneCount;
  document.getElementById("urgent-count").textContent = urgentCount;
  document.getElementById("due-date").textContent = upcomingDeadline.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  document.getElementById("total-count").textContent = totalCount;
  document.getElementById("progress-count").textContent = progressCount;
  document.getElementById("feedback-count").textContent = feedbackCount;
  document.getElementById("name").textContent = currentUser.name;
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

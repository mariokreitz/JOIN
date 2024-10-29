/**
 * Initializes the page by loading the necessary components and rendering
 * the contact list.
 *
 * @returns {Promise<void>} A promise that resolves when the page has been
 * initialized.
 */
async function init() {
  showGreeting();
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

/**
 * Populates the DOM elements with counts of different types of todos and user information.
 *
 * @param {Array} todos - An array of todo objects, each containing state, priority, and other properties.
 */
function populateCounters(todos) {
  updateTodoCounts(todos);
  updateUserInfo();
  updateDueDate(todos);
}

/**
 * Updates the count of todos in different states.
 *
 * @param {Array} todos - An array of todo objects.
 */
function updateTodoCounts(todos) {
  document.getElementById("todo-count").textContent = countTodos(todos, "todo");
  document.getElementById("done-count").textContent = countTodos(todos, "done");
  document.getElementById("progress-count").textContent = countTodos(todos, "progress");
  document.getElementById("feedback-count").textContent = countTodos(todos, "feedback");
  document.getElementById("urgent-count").textContent = countUrgentTodos(todos);
  document.getElementById("total-count").textContent = todos.length;
}

/**
 * Updates the user information displayed on the page.
 */
function updateUserInfo() {
  document.getElementById("name").textContent = currentUser.name;
}

/**
 * Updates the due date display and its label based on the earliest deadline of urgent todos.
 *
 * @param {Array} todos - An array of todo objects.
 */
function updateDueDate(todos) {
  const { date } = findEarliestDeadline(todos);
  const dueDateElement = document.getElementById("due-date");
  const deadlineTextElement = document.getElementById("deadline-text");

  if (date !== "No urgent tasks") {
    updateDueDateText(dueDateElement, date);
  } else {
    clearDueDate(dueDateElement, deadlineTextElement);
  }
}

/**
 * Updates the text and color of the due date element and the label text.
 *
 * @param {HTMLElement} dueDateElement - The DOM element for displaying the due date.
 * @param {Date} date - The date of the earliest deadline.
 */
function updateDueDateText(dueDateElement, date) {
  dueDateElement.textContent = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPastDue = date < today;
  dueDateElement.classList.toggle("overdue", isPastDue);
  dueDateElement.classList.toggle("upcoming", !isPastDue);
  const deadlineTextElement = document.getElementById("deadline-text");
  deadlineTextElement.textContent = isPastDue ? "Overdue Deadline" : "Upcoming Deadline";
}

/**
 * Clears the due date display and resets the label text.
 *
 * @param {HTMLElement} dueDateElement - The DOM element for displaying the due date.
 * @param {HTMLElement} deadlineTextElement - The DOM element for displaying the label text.
 */
function clearDueDate(dueDateElement, deadlineTextElement) {
  dueDateElement.textContent = "No urgent Deadline";
  dueDateElement.classList.remove("overdue", "upcoming");
  deadlineTextElement.textContent = "";
}

/**
 * Finds the earliest deadline among urgent todos that are not marked as done.
 *
 * @param {Array} todos - An array of todo objects.
 * @returns {Object} An object containing the earliest deadline as a Date object.
 */
function findEarliestDeadline(todos) {
  const urgentTasks = todos.filter((todo) => todo.priority === "high" && todo.state !== "done");
  if (urgentTasks.length > 0) {
    const earliest = urgentTasks.reduce((earliest, todo) => {
      const todoDate = new Date(todo.date);
      return todoDate < earliest ? todoDate : earliest;
    }, new Date(urgentTasks[0].date));
    return {
      date: earliest,
    };
  }
  return { date: "No urgent tasks" };
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

/**
 * Displays the greeting container if the screen width is less than 1080 pixels.
 * The container is visible for 2 seconds, and then fades out.
 * During the animation, body scrolling is disabled.
 *
 * @function showGreeting
 */
function showGreeting() {
  const greetingContainer = document.getElementById("greeting-container");
  if (window.innerWidth < 1080) {
    greetingContainer.classList.add("show");
    setTimeout(() => {
      greetingContainer.classList.add("fade-out");
      setTimeout(() => {
        greetingContainer.style.display = "none";
        document.body.style.overflow = "";
      }, 600);
    }, 2000);
    document.body.style.overflow = "hidden";
  }
}

/**
 * Initializes the page by loading the necessary components and rendering
 * the contact list.
 *
 * @returns {Promise<void>} A promise that resolves when the page has been
 * initialized.
 */
async function init() {
  loadComponents();
  loadDemo();
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

const todoArray = [
  {
    category: "User Story",
    title: "Task Card Small",
    description: "complete the task-card-small template",
    priority: "high",
    assigendMembers: ["Mario Kreitz", "Christian Zala", "Murat Catili"],
  },
  {
    category: "Technical Task",
    title: "Board Drag & Drop",
    description: "implement the drag and drop function",
    priority: "high",
    assigendMembers: ["Mario Kreitz", "Christian Zala", "Murat Catili"],
  },
];

function loadDemo() {
  const todoColumn = document.getElementById("board-todo");
  if (!todoColumn) return;

  todoArray.forEach((todo, index) => {
    const todoElement = getTaskCardSmallTemplate(index, todo.category, todo.title, todo.description, todo.priority);
    todoColumn.insertAdjacentHTML("beforeend", todoElement);

    const assignedMembersElement = document.getElementById(`assigned-members-${index}`);
    if (!assignedMembersElement) return;

    todo.assigendMembers.forEach((member) => {
      const initials = getInitialsFromContact({ name: member });
      assignedMembersElement.insertAdjacentHTML("beforeend", getAssignedMemberTemplate(initials));
    });
  });
}

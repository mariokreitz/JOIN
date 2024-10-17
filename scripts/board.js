async function init() {
  loadComponents();
  await getData(API_URL);
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

/**
 * Fetches data from the given URL and sets the contacts array to the data in the contacts key.
 * If the data does not have a contacts key, the contacts array is set to an empty array.
 * @param {string} url - The URL to fetch from.
 * @returns {Promise<void>} - A promise that resolves when the data has been fetched and the contacts array has been set.
 */
async function getData(url) {
  contacts = await getDataFromFirebase(url);
}

async function loadDemo() {
  const todoColumn = document.getElementById("board-todo");
  if (!todoColumn) return;

  const todos = await fetchData(`${API_URL}/guest/todos.json`);

  const demoTodosArr = objectToArray(todos);
  demoTodosArr.forEach((todo, index) => {
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

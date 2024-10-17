async function init() {
  loadComponents();
  await getContactsFromData(API_URL, "guest");
  await getTodosFromData(API_URL, "guest");
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

async function loadDemo() {
  const todoColumn = document.getElementById("board-todo");
  const progressColumn = document.getElementById("board-progress");
  const feedbackColumn = document.getElementById("board-feedback");
  const doneColumn = document.getElementById("board-done");
  if (!todoColumn || !progressColumn || !feedbackColumn || !doneColumn) return;

  globalTodos.forEach((todo, index) => {
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

    const assignedMembersElement = document.getElementById(`assigned-members-${index}`);
    if (!assignedMembersElement) return;

    assignedMembersArr = objectToArray(todo.assignedMembers);

    assignedMembersArr.forEach((member) => {
      const initials = getInitialsFromContact({ name: member });
      const foundMember = globalContacts.find((contact) => contact.name == member);

      assignedMembersElement.insertAdjacentHTML("beforeend", getAssignedMemberTemplate(initials, foundMember.color));
    });
  });
}

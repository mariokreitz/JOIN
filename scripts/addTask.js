/**
 * Initializes the page by loading the necessary components and rendering
 * the contact list.
 *
 * @returns {Promise<void>} A promise that resolves when the page has been
 * initialized.
 */
async function init() {
  loadComponents();
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
  navbar.innerHTML = getNavbarTemplate("add-task");
}

function handleButtonClick(event) {
  const buttons = document.querySelectorAll(".priority-actions button");
  const clickedButton = event.currentTarget;

  if (clickedButton.classList.contains("active")) {
    clickedButton.classList.remove("active");
    console.log("No priority selected");
  } else {
    buttons.forEach((button) => button.classList.remove("active"));
    clickedButton.classList.add("active");
    const activeButton = clickedButton.textContent.trim();
    console.log("Active priority:", activeButton);
  }
}

document.getElementById("subtasks").addEventListener("input", function () {
  const addIcon = document.querySelector(".add-icon");
  const subtaskActions = document.querySelector(".subtask-actions");

  if (this.value.trim() !== "") {
    addIcon.style.display = "none";
    subtaskActions.style.display = "flex";
  } else {
    addIcon.style.display = "block";
    subtaskActions.style.display = "none";
  }
});

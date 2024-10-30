/**
 * Opens the 'Add Task' modal with the specified state and loads necessary scripts.
 *
 * This function updates the global state and checks if the device is mobile.
 * If mobile, it redirects to the add-task page. Otherwise, it opens a modal
 * by creating and appending a modal element to the DOM. It loads additional
 * scripts required for the modal and inserts the task template into the modal content.
 * Finally, it applies a slide-in animation and restricts date selection to future dates.
 *
 * @param {string} [state="todo"] - The initial state of the task being added.
 */
function openAddTaskModal(state = "todo") {
  globalState = state;
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    window.location.href = "/add-task.html";
    return;
  }

  document.body.style.overflow = "hidden";
  const modal = document.createElement("div");
  modal.innerHTML = getAddTaskModalTemplate();
  document.body.appendChild(modal);

  const scriptsToLoad = [
    "./scripts/addTask.js",
    "./scripts/templates/subtaskListItem.js",
    "./scripts/templates/contactlistDropdown.template.js",
    "./scripts/templates/addTask.template.js",
  ];

  loadScripts(scriptsToLoad, () => {
    const modalContent = document.getElementById("modal-content");
    modalContent.insertAdjacentHTML("beforeend", getAddTaskTemplate());
    setDefaultPriority();
    renderContactDropdown();
    applyAnimation("slide-in");
    restrictPastDatePick();
  });
}

/**
 * Closes the add task modal and removes it from the DOM. It also removes
 * the scripts required for the modal and re-enables body scrolling.
 *
 * @param {Event} [event] - The event that triggered the modal to close.
 */
function closeAddTaskModal(event) {
  if (event) event.preventDefault();

  const modalElement = document.getElementById("add-task-modal");
  if (modalElement) {
    applyAnimation("slide-out");
    modalElement.addEventListener("animationend", () => {
      document.body.style.overflow = "auto";
      modalElement.remove();

      const scriptsToUnload = [
        "./scripts/addTask.js",
        "./scripts/templates/subtaskListItem.js",
        "./scripts/templates/contactlistDropdown.template.js",
        "./scripts/templates/addTask.template.js",
      ];

      scriptsToUnload.forEach((scriptSource) => {
        const existingScript = document.querySelector(`script[src="${scriptSource}"]`);
        if (existingScript) {
          existingScript.parentNode.removeChild(existingScript);
        }
      });
    });
  }
}

/**
 * Applies the given animation to the modal content element.
 *
 * @param {string} animationType - The type of animation to apply.
 */

function applyAnimation(animationType) {
  const modalContent = document.getElementById("modal-content");
  modalContent.style.animation = `${animationType} 0.3s ease-out forwards`;
}

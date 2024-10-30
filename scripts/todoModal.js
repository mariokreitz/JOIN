/**
 * Toggles the state of the priority button with the given id.
 *
 * It resets the state of all priority buttons and then toggles the
 * state of the button with the given id. If the button is currently
 * active, it will be made inactive and vice versa.
 *
 * @param {string} id - The id of the priority button to be toggled.
 */
function togglePriorityState(id) {
  resetPriorityStates();
  const element = document.getElementById(id);
  if (!element) return;
  element.classList.toggle("active");
}

/**
 * Resets the state of all priority buttons to inactive.
 *
 * It queries all priority container elements by the class name
 * "bc-prio-select" and removes the "active" class from each of
 * them, effectively resetting their state to inactive.
 */
function resetPriorityStates() {
  const priorityContainers = document.querySelectorAll(".bc-prio-select");
  if (!priorityContainers) return;

  priorityContainers.forEach((container) => {
    container.classList.remove("active");
  });
}

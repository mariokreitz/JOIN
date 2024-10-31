/**
 * Highlights the drag area element identified by the given elementId by adding
 * the "drag-area" class to it. Also toggles the placeholder element for the
 * given elementId. If the element is already highlighted or does not exist,
 * the function does nothing.
 *
 * @param {string} elementId - The id of the drag area element to highlight.
 */
function addDragAreaHighlighting(elementId) {
  const dragAreaElement = document.getElementById(elementId);
  if (!dragAreaElement || currentTarget === dragAreaElement) return;

  dragAreaElement.classList.add("drag-area");
  togglePlaceholder(elementId);
  addHollowPlaceholder(elementId);
  currentTarget = dragAreaElement;
}

/**
 * Removes the highlighting from the drag area element with the given elementId
 * by removing the "drag-area" class from it. Also toggles the placeholder
 * element for the given elementId. If the element is already highlighted or
 * does not exist, the function does nothing.
 * @param {string} elementId - The id of the drag area element to remove highlighting from.
 */
function removeDragAreaHighlighting(elementId) {
  const dragAreaElement = document.getElementById(elementId);
  if (!dragAreaElement) return;

  dragAreaElement.classList.remove("drag-area");
  togglePlaceholder(elementId);
  removeHollowPlaceholder(elementId);
  currentTarget = null;
}

/**
 * Attaches event listeners to each todo item to set its cursor style based on whether the left mouse button is being
 * pressed or not. This is necessary because the CSS `:active` pseudo-class does not work when the element is being
 * dragged.
 *
 * @returns {void}
 */
function handleDragEvents() {
  document.querySelectorAll(".task-card-small").forEach((element) => {
    element.addEventListener("mousedown", (event) => {
      if (event.button === 0) element.style.cursor = "grab";
    });
    element.addEventListener("mouseup", (event) => {
      if (event.button === 0) element.style.cursor = "pointer";
    });
  });
}

/**
 * Renders a placeholder element in each column if the column is empty.
 *
 * @returns {void}
 */
function renderPlaceholder() {
  if (!todoColumn || !progressColumn || !feedbackColumn || !doneColumn) return;
  const columns = [todoColumn, progressColumn, feedbackColumn, doneColumn];
  columns.forEach((column) => {
    if (!column.innerHTML) {
      column.insertAdjacentHTML(
        "beforeend",
        /*html*/ `
        <div class="board-column-placeholder inter-extralight">
          <p>${getPlaceholderText(column)}</p>
        </div>`
      );
    }
  });
}

/**
 * Toggles the visibility of the placeholder element within the specified column.
 *
 * @param {string} elementId - The ID of the column element in which to toggle the placeholder.
 */
function togglePlaceholder(elementId) {
  const element = document.getElementById(elementId);
  const placeholder = element.querySelector(".board-column-placeholder");
  if (!placeholder) return;
  placeholder.classList.toggle("d_none");
}

/**
 * Makes the hollow rag area placeholder within the specified column
 * visible by removing the "d_none" class from it.
 *
 * @param {string} elementId - The ID of the column element in which to show the hollow placeholder.
 */
function addHollowPlaceholder(elementId) {
  const element = document.getElementById(elementId);
  const placeholder = element.querySelector(".drag-area-hollow-placeholder");
  if (!placeholder) return;
  placeholder.classList.remove("d_none");
}

/**
 * Hides the hollow drag area placeholder within the specified column
 * by adding the "d_none" class to it.
 *
 * @param {string} elementId - The ID of the column element in which to hide the hollow placeholder.
 */
function removeHollowPlaceholder(elementId) {
  const element = document.getElementById(elementId);
  const placeholder = element.querySelector(".drag-area-hollow-placeholder");
  if (!placeholder) return;
  placeholder.classList.add("d_none");
}

/**
 * Handles the drop event of a todo card being dragged to a new column.
 *
 * Calls updateTodo to update the state of the todo in the global todos array
 * and patches the todos object in the Firebase Realtime Database.
 *
 * Then, it clears all columns on the board and renders all todos again. Finally,
 * it calls renderAllPlaceholder to render all placeholder elements and
 * removeAllHighlights to remove any highlights from the board.
 *
 * @param {string} state - The new state of the todo.
 * @returns {void}
 */
function onDrop(state) {
  updateTodo(state);
  triggerRender();
  removeAllHighlights();
}

/**
 * Sets the currently dragged element to the given todoId and adds the "dragging"
 * class to the corresponding task card element.
 *
 * @param {number} todoId - The ID of the todo element that is being dragged.
 * @returns {void}
 */
function startDraggingTodo(todoId) {
  currentlyDraggedElement = todoId;
  const todoCardElement = document.getElementById(`task-card-small-${todoId}`);
  if (!todoCardElement) return;

  todoCardElement.classList.add("dragging");

  document.addEventListener(
    "dragend",
    () => {
      todoCardElement.classList.remove("dragging");
      document.body.style.cursor = "";
    },
    { once: true }
  );
}

/**
 * Allows an element to be dropped by preventing the default behavior.
 *
 * This function is used as an event handler for the `ondragover` event,
 * enabling drag-and-drop functionality on an element.
 *
 * @param {Event} event - The dragover event object.
 */
function allowDrop(event) {
  event.preventDefault();
}

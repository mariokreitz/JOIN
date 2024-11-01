/**
 * Destructures the columns from the DOM elements.
 *
 * @type {Object}
 * @property {HTMLElement} todoColumn - The todo column element.
 * @property {HTMLElement} progressColumn - The progress column element.
 * @property {HTMLElement} feedbackColumn - The feedback column element.
 * @property {HTMLElement} doneColumn - The done column element.
 */
let { todoColumn, progressColumn, feedbackColumn, doneColumn } = {};

/**
 * An object representing the different states a task can be in.
 *
 * @type {Object}
 * @property {string} todo - Represents tasks that are to be done.
 * @property {string} progress - Represents tasks that are in progress.
 * @property {string} feedback - Represents tasks awaiting feedback.
 * @property {string} done - Represents tasks that are completed.
 */
const todoStates = {
  todo: "Todo",
  progress: "In Progress",
  feedback: "Awaiting Feedback",
  done: "Done",
};

/**
 * Reference to the search task input element.
 *
 * @type {HTMLInputElement}
 */
let searchTodoRef;

/**
 * Reference to the currently dragged element.
 *
 * @type {number}
 */
let currentlyDraggedElement;

/**
 * The current target element being interacted with, used to determine
 * whether to highlight a drag area or not.
 *
 * @type {HTMLElement|null}
 */
let currentTarget = null;

/**
 * Generates a string that describes the number of done subtasks out of the total number of subtasks.
 * @param {Object<string, import('./types').SubTask>} subTasks - Object of subtasks with their IDs as keys.
 * @returns {string} The string that describes the number of done subtasks out of the total number of subtasks.
 */
function getSubtasksText(subTasks) {
  const subTasksArray = objectToArray(subTasks);
  const doneSubtasks = getDoneAmount(subTasks);
  return `${doneSubtasks}/${subTasksArray.length} Subtasks`;
}

/**
 * Calculates the progress value in percent from the given subTasks.
 * The progress value is determined by the number of done subtasks divided by the total number of subtasks.
 * @param {Object<string, import('./types').SubTask>} subTasks - Object of subtasks with their IDs as keys.
 * @returns {number} The progress value in percent.
 */
function getProgressValueFromSubTasks(subTasks) {
  const subTasksArray = objectToArray(subTasks);
  const subTasksDone = getDoneAmount(subTasks);
  const subTasksTotal = subTasksArray.length;
  const progressValue = (subTasksDone / subTasksTotal) * 100;
  return progressValue;
}
/**
 * Counts the number of tasks that are marked as done in the given subTasks array.
 *
 * @param {Array<Object>} subTasks - The array of subTasks to count done tasks from.
 * @returns {number} The number of tasks that are marked as done.
 */
function getDoneAmount(subTasks) {
  const taskArray = objectToArray(subTasks);
  let tasksDone = 0;
  taskArray.forEach((task) => {
    if (task.state) {
      tasksDone++;
    }
  });
  return tasksDone;
}

/**
 * Sets the title and onclick attribute on the progress bar for each task so that it displays a tooltip with the text
 * returned by getSubtasksText when clicked.
 * @param {number} taskIndex - The index of the current task.
 * @param {Object<string, import('./types').SubTask>} taskSubTasks - Object of subtasks with their IDs as keys.
 */
function setProgressBarTooltip(taskIndex, taskSubTasks) {
  const progressBar = document.getElementById(`progress-bar-${taskIndex}`);
  if (!progressBar) return;
  let isTooltipVisible = false;
  const subtasksText = getSubtasksText(taskSubTasks);

  progressBar.title = `${subtasksText} done`;
  progressBar.addEventListener("click", (event) => {
    event.stopPropagation();
    if (isTooltipVisible) return;
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.textContent = `${subtasksText} done`;
    tooltip.style.top = `${event.offsetY + 15}px`;
    tooltip.style.left = `${event.offsetX + 10}px`;

    progressBar.appendChild(tooltip);
    isTooltipVisible = true;
    setTimeout(() => {
      tooltip.remove();
      isTooltipVisible = false;
    }, 1500);
  });
}

/**
 * Converts a given date string to a human-readable string in the default
 * locale format.
 *
 * @param {string} dueDate - The date string to be formatted.
 * @returns {string} The formatted date string.
 */
function formatDueDate(dueDate) {
  return new Date(dueDate).toLocaleDateString();
}

/**
 * Returns a placeholder text for a given column element.
 *
 * @param {Object} columnElement - A column element from the board.
 * @param {string} columnElement.id - The id of the column element.
 *
 * @returns {string} The placeholder text for the column.
 */
function getPlaceholderText({ id }) {
  return `No tasks in ${id.split("-")[1].charAt(0).toUpperCase() + id.split("-")[1].slice(1)}`;
}

/**
 * Truncates a given text string to a maximum length of 45 characters.
 * If the given text is longer than 45 characters, it will be truncated
 * and an ellipsis will be appended to the end to indicate that the
 * text has been shortened.
 *
 * @param {string} text - The text to be truncated.
 * @returns {string} The truncated text.
 */
function truncateText(text) {
  if (typeof text !== "string" || text.length === 0) return text;

  const maxLength = 45;
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

/**
 * Sets the minimum date for the due date input to the current date, to
 * prevent the user from selecting a date in the past.
 */
function restrictPastDatePick() {
  const dueDateElement = document.getElementById("due-date");
  if (!dueDateElement) return;

  const currentDate = new Date().toISOString().split("T")[0];
  dueDateElement.min = currentDate;
}

/**
 * Loads an array of scripts into the document, and executes a callback
 * when all have finished loading.
 *
 * @param {string[]} scripts - An array of script URLs to load.
 * @param {Function} callback - A function to execute when all scripts have finished loading.
 */
function loadScripts(scripts, callback) {
  let scriptsLoaded = 0;

  scripts.forEach((src) => {
    if (!document.querySelector(`script[src="${src}"]`)) {
      const scriptElement = document.createElement("script");
      scriptElement.src = src;
      /**
       * Increments the count of loaded scripts and checks if all scripts
       * have been loaded. If so, executes the provided callback function.
       */
      scriptElement.onload = () => {
        scriptsLoaded++;
        if (scriptsLoaded === scripts.length) callback();
      };
      document.head.appendChild(scriptElement);
    } else scriptsLoaded++;
  });
}

/**
 * Collects the values of the various form elements and returns an object containing
 * the task title, description, due date, priority and assigned members.
 *
 * @param {string} urgentElementId - The ID of the element representing the urgent priority.
 * @param {string} mediumElementId - The ID of the element representing the medium priority.
 * @param {string} lowElementId - The ID of the element representing the low priority.
 * @param {string} titleId - The ID of the title input element.
 * @param {string} descriptionId - The ID of the description textarea element.
 * @param {string} dueDateId - The ID of the due date input element.
 * @returns {Object} An object containing the task title, description, due date, priority and assigned members.
 */
function getFormData(urgentElementId, mediumElementId, lowElementId, titleId, descriptionId, dueDateId) {
  const selectedPriority = getSelectedPriorityValue(urgentElementId, mediumElementId, lowElementId);
  const title = getNewTitleValue(titleId);
  const description = getNewDescriptionValue(descriptionId);
  const dueDate = getNewDueDateValue(dueDateId);
  const assignedMembers = getAssignedMembersNames();

  return { title, description, dueDate, selectedPriority, assignedMembers };
}

/**
 * Retrieves the names of the assigned members based on the selected options.
 *
 * @returns {string[]} An array of names of the assigned members.
 */
function getAssignedMembersNames() {
  return selectedOptions.reduce((acc, id) => {
    acc[globalContacts[id].name] = globalContacts[id];
    return acc;
  }, {});
}

/**
 * Given the element IDs of the urgent, medium and low priority elements, returns
 * the string value of the currently selected priority.
 *
 * @param {string} urgentElementID - The ID of the element representing the urgent priority.
 * @param {string} mediumElementID - The ID of the element representing the medium priority.
 * @param {string} lowElementID - The ID of the element representing the low priority.
 * @returns {string|null} The string value of the currently selected priority, or null if none is selected.
 */
function getSelectedPriorityValue(urgentElementID, mediumElementID, lowElementID) {
  const isUrgentActive = document.getElementById(urgentElementID).classList.contains("active");
  const isMediumActive = document.getElementById(mediumElementID).classList.contains("active");
  const isLowActive = document.getElementById(lowElementID).classList.contains("active");

  if (isUrgentActive) return "high";
  if (isMediumActive) return "medium";
  if (isLowActive) return "low";

  return null;
}

/**
 * Retrieves the new title value from the title input field.
 *
 * @param {string} todoTitelID - The ID of the input field containing the new title.
 * @returns {string} The value of the input field with the given ID, representing the new title of the todo.
 */
function getNewTitleValue(todoTitelID) {
  return document.getElementById(todoTitelID).value;
}

/**
 * Retrieves the new description value from the description textarea field.
 *
 * @param {string} todoDescriptionElementID - The ID of the textarea field containing the new description.
 * @returns {string} The value of the textarea field with the given ID, representing the new description of the todo.
 */
function getNewDescriptionValue(todoDescriptionElementID) {
  return document.getElementById(todoDescriptionElementID).value;
}

/**
 * Retrieves the new due date value from the due date input field.
 *
 * @param {string} duoDateElementID - The ID of the input field containing the new due date.
 * @returns {string} The value of the input field with the given ID, representing the new due date of the todo.
 */
function getNewDueDateValue(duoDateElementID) {
  return document.getElementById(duoDateElementID).value;
}

/**
 * Checks if the due date of a todo item is today or earlier, excluding completed tasks.
 *
 * @param {number} index - The index of the todo item in the globalTodos array.
 * @returns {boolean|undefined} Returns true if the due date is today or earlier, false otherwise.
 * Returns undefined if the task is completed.
 */
function isDueOrOverdue(index) {
  const todo = globalTodos[index];
  if (todo.state === "done") return;

  const today = new Date();
  const dueDate = new Date(todo.date);
  return (
    dueDate.getFullYear() < today.getFullYear() ||
    (dueDate.getFullYear() === today.getFullYear() && dueDate.getMonth() < today.getMonth()) ||
    (dueDate.getFullYear() === today.getFullYear() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getDate() <= today.getDate())
  );
}

/**
 * Clears all task cards from all columns on the board.
 *
 * This function is called whenever the user searches for a task, in order to clear the
 * board and then render only the found tasks.
 *
 * @returns {void}
 */
function clearBoardColumns() {
  todoColumn.innerHTML = "";
  progressColumn.innerHTML = "";
  feedbackColumn.innerHTML = "";
  doneColumn.innerHTML = "";
}

/**
 * Removes the "drag-area" class from all elements, effectively removing
 * the highlighting from all drag areas on the board.
 *
 * @returns {void}
 */
function removeAllHighlights() {
  const dragAreas = document.querySelectorAll(".drag-area");
  if (!dragAreas) return;
  dragAreas.forEach((dragArea) => dragArea.classList.remove("drag-area"));
}

/**
 * Triggers the rendering of the entire board by clearing the columns, rendering all
 * todo items and rendering all placeholder elements.
 *
 * @returns {void}
 */
function triggerRender() {
  clearBoardColumns();
  renderTodos(globalTodos);
  renderAllPlaceholder();
}

/**
 * Renders a hollow drag area placeholder in each column, which is used to
 * indicate a place where a task card can be dragged to.
 *
 * @returns {void}
 */
function renderHollowPlaceholder() {
  if (!todoColumn || !progressColumn || !feedbackColumn || !doneColumn) return;
  const columns = [todoColumn, progressColumn, feedbackColumn, doneColumn];
  columns.forEach((column) => column.insertAdjacentHTML("beforeend", getDragAreaHollowPlaceholder()));
}

/**
 * Renders all placeholder elements on the board, including the regular placeholder and the hollow drag area placeholder.
 */
function renderAllPlaceholder() {
  renderPlaceholder();
  renderHollowPlaceholder();
}

/**
 * Retrieves the column elements from the DOM and assigns them to the corresponding variables.
 * The todo, progress, feedback, and done column elements are obtained using their respective IDs.
 *
 * @returns {void}
 */
function getBoardColumnsFromDOM() {
  searchTodoRef = document.getElementById("search-task");
  ({ todoColumn, progressColumn, feedbackColumn, doneColumn } = getBoardColumns());
}

/**
 * Returns the color of the assigned member specified by the given name.
 *
 * @param {string} assignedMemberName - The name of the assigned member.
 * @returns {string|undefined} The color of the assigned member or undefined if no contact with the given name is found.
 */
function getAssignedMemberColor(assignedMemberName) {
  const contact = globalContacts.find((contact) => contact.name === assignedMemberName);
  return contact ? contact.color : undefined;
}

/**
 * Clears the board columns and renders only the specified todos. Additionally, renders
 * the regular placeholder and hollow drag area placeholder.
 *
 * @param {Todo[]} todos The list of todos to render.
 * @returns {void}
 */
function renderSpecificTodos(todos) {
  clearBoardColumns();
  renderTodos(todos);
  renderPlaceholder();
  renderHollowPlaceholder();
}

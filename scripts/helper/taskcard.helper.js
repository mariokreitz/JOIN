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
 * Truncates a given text to a maximum length and appends an ellipsis if necessary.
 *
 * @param {string} text - The text to be truncated.
 * @returns {string} The truncated text.
 */
function truncateText(text) {
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

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
/**
 * Returns a string of HTML for a small task card with the given parameters.
 *
 * The returned HTML will be a div with the class "task-card-small" and the given index as its ID.
 * It will have a header with the category, a body with the title, description, and a progress bar
 * if there are subtasks, and a footer with the assigned members and a priority icon.
 *
 * @param {number} index - The index of the task card in the global todos array.
 * @param {object} task - The task object from the global todos array.
 * @param {string} task.category - The category of the task, either "Technical Task" or "User Story".
 * @param {string} task.description - The description of the task.
 * @param {string} task.priority - The priority of the task, either "high", "medium", or "low".
 * @param {string} task.title - The title of the task.
 * @param {object} task.subTasks - The subtasks object of the task.
 * @returns {string} - The HTML string for the small task card.
 */
function getTaskCardSmallTemplate(index, { category, description, priority, title, subTasks }) {
  return /*html*/ `
  <div class="task-card-small" id="task-card-small-${index}" onclick="openTodoModal(${index})" draggable="true" ondragstart="startDraggingTodo(${index})">
    <div class="card-small-header">
      <p class="inter-extralight ${category === "Technical Task" ? "technical-task" : "user-story"}">${category}</p>
      <button onclick="openStateChangeMenu(event, ${index})" type="button" class="btn btn-custom-more">
        <img src="./assets/svg/more-vert.svg" alt="More Icon">
      </button>
      <div id="card-switch-state-${index}" class="card-switch-state-menu d_none">
        <p class="inter-medium">Move to:</p>
      </div>
    </div>
      <div class="card-small-body">
        <div class="card-small-info">
          <p class="card-small-subheadline inter-medium">${truncateText(title)}</p>
          <p class="card-small-description inter-extralight">${truncateText(description)}</p>
        </div>
        ${
          getObjectLength(subTasks) > 0
            ? /*html*/ `
        <div class="card-small-progress-bar">
          <div id="progress-bar-${index}" class="card-small-progress-bar-background">
            <div class="card-small-progress-bar-foreground" style="width: ${getProgressValueFromSubTasks(
              subTasks
            )}%"></div>
          </div>
          <span class="card-small-progress-bar-text inter-extralight">${getSubtasksText(subTasks)}</span>
        </div>
        `
            : ""
        }
      </div>
      <div class="card-small-card-footer">
        <div id="assigned-members-${index}" class="card-small-assigned-members"></div>
        <div class="card-small-urgency-icon">
          ${priority === "high" ? highPriotiySVG() : priority === "medium" ? mediumPriotiySVG() : lowPriotiySVG()}
        </div>
      </div>
  </div>
  `;
}

/**
 * Given the initials and color of a contact, returns an
 * HTML string representing a single contact item in the assigned members section
 * of a task card.
 *
 * @param {string} [initials="?"] - The initials of the contact.
 * @param {string} [color="red"] - The color of the contact's avatar.
 * @returns {string} An HTML string representing the assigned member item.
 */
function getAssignedMemberTemplate(color = "red", initials = "?") {
  return /*html*/ `
    <div class="card-mall-assigend-member-badge" style="background-color: ${color}">${initials}</div>
  `;
}

/**
 * Returns an HTML string representing a hollow drag area placeholder, used to
 * indicate a place where a task card can be dragged to.
 *
 * @returns {string} An HTML string representing the hollow drag area placeholder.
 */
function getDragAreaHollowPlaceholder() {
  return /*html*/ `
    <div class="drag-area-hollow-placeholder d_none"></div>
  `;
}

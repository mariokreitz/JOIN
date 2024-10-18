function getTaskCardSmallTemplate(index, { category, description, priority, title, subTasks }) {
  return /*html*/ `
  <div class="task-card-small" draggable="true" ondragstart="onDragStart(${index})">
    <div class="card-small-header" style="background-color:${category === "Technical Task" ? "#1FD7C1" : "#0038ff"}">
      <p class="inter-extralight">${category}</p>
    </div>
      <div class="card-small-body">
        <div class="card-small-info">
          <p class="card-small-subheadline inter-medium">${title}</p>
          <p class="card-small-description inter-extralight">${description}</p>
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
 * @param {string} [initials="MK"] - The initials of the contact.
 * @param {string} [color="red"] - The color of the contact's avatar.
 * @returns {string} An HTML string representing the assigned member item.
 */
function getAssignedMemberTemplate(color = "red", initials = "?") {
  return /*html*/ `
    <div class="card-mall-assigend-member-badge" style="background-color: ${color}">${initials}</div>
  `;
}

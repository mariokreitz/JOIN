function getTaskCardSmallTemplate(index = 0, category = "N/A", title = "N/A", description = "N/A", priority = "high") {
  return /*html*/ `
    <div class="task-card-small">
        <div class="card-small-header"  style="background-color:${
          category === "Technical Task" ? "#1FD7C1" : "#0038ff"
        }">
            <p class="inter-extralight">${category}</p>
        </div>
        <div class="card-small-body">
            <div class="card-small-info">
            <p class="card-small-subheadline inter-medium">${title}</p>
            <p class="card-small-description inter-extralight">${description}</p>
            </div>
            <div class="card-small-progress-bar">
            <div class="card-small-progress-bar-background">
                <div class="card-small-progress-bar-foreground" style="width: 50%"></div>
            </div>
            <span class="card-small-progress-bar-text inter-extralight">1/2 Subtasks</span>
            </div>
        </div>
        <div class="card-small-card-footer">
            <div id="assigned-members-${index}" class="card-small-assigned-members">
            </div>
            <div class="card-small-urgency-icon">
                ${priority === "high" ? highPriotiySVG() : priority === "medium" ? mediumPriotiySVG() : lowPriotiySVG()}
            </div>
        </div>
    </div>
  `;
}

function getAssignedMemberTemplate(initials = "MK") {
  /**
   * Given the initials of a contact, returns an HTML string representing a single
   * contact's avatar in the assigned members section of a task card.
   *
   * @param {string} [initials="MK"] - The initials of the contact.
   * @returns {string} An HTML string representing the contact's avatar.
   */
  return /*html*/ `
    <div class="card-mall-assigend-member-badge">${initials}</div>
  `;
}

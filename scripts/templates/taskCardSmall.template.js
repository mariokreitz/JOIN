function getTaskCardSmallTemplate(title = "N/A", subheadline = "N/A", description = "N/A", priority = "high") {
  return /*html*/ `
    <div class="task-card-small">
        <div class="card-small-header">
            <p class="inter-extralight">${title}</p>
        </div>
        <div class="card-small-body">
            <div class="card-small-info">
            <p class="card-small-subheadline inter-medium">${subheadline}</p>
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
            <div class="card-small-assigned-members">
            <div class="card-mall-assigend-member-badge">MK</div>
            <div class="card-mall-assigend-member-badge">CZ</div>
            <div class="card-mall-assigend-member-badge">MC</div>
            </div>
            <div class="card-small-urgency-icon">
                ${priority === "high" ? highPriotiySVG() : priority === "medium" ? mediumPriotiySVG() : lowPriotiySVG()}
            </div>
        </div>
    </div>
  `;
}

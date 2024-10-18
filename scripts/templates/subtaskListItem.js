function createSubtaskListItem(subtaskText) {
  const li = document.createElement("li");

  li.innerHTML = `
      <span class="subtask-text">${subtaskText}</span>
      <div class="list-item-actions">
        <div class="icon-container" onclick="editSubtask(this)">
          <img src="assets/svg/edit-dark.svg" alt="edit icon" class="icon edit-icon" />
        </div>
        <div class="icon-seperator"></div>
        <div class="icon-container" onclick="removeSubtask(this)">
          <img src="assets/svg/delete-dark.svg" alt="delete icon" class="icon delete-icon" />
        </div>
      </div>
    `;

  return li;
}

function subtaskListTemplate(subtaskText) {
  return /* HTML */ `
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
}

function getAcceptAndDeleteIconsTemplate() {
  return /* HTML */ `
    <div class="icon-container" onclick="removeSubtask(this)">
      <img src="assets/svg/delete-dark.svg" alt="delete icon" class="icon delete-icon" />
    </div>
    <div class="icon-seperator"></div>
    <div class="icon-container" onclick="saveEdit(this)">
      <img src="assets/svg/check-mark-dark.svg" alt="accept icon" class="icon accept-icon" />
    </div>
  `;
}

function getEditAndDeleteIconsTemplate() {
  return /* HTML */ `
    <div class="icon-container" onclick="editSubtask(this)">
      <img src="assets/svg/edit-dark.svg" alt="edit icon" class="icon edit-icon" />
    </div>
    <div class="icon-seperator"></div>
    <div class="icon-container" onclick="removeSubtask(this)">
      <img src="assets/svg/delete-dark.svg" alt="delete icon" class="icon delete-icon" />
    </div>
  `;
}

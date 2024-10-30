/**
 * Returns a string of HTML for a subtask list item with the given subtask text.
 * The returned HTML will be a span element with the subtask text and a div
 * element with the "edit" and "delete" icons.
 * @param {string} subtaskText - The text of the subtask.
 * @returns {string} - The HTML string for the subtask list item.
 */
function getSubtaskListItemTemplate(subtaskText) {
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

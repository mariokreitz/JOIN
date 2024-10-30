/**
 * Returns the template for the add task modal.
 *
 * The template includes a .modal-overlay with a .modal-content element inside.
 * The .modal-content has a close button as its first child.
 *
 * @returns {string} The html template for the add task modal.
 */
function getAddTaskModalTemplate() {
  return /*html*/ `
    <div class="modal-overlay" id="add-task-modal">
        <div class="modal-content" id="modal-content">
            <span class="close-btn" onclick="closeAddTaskModal()"><img src="./assets/svg/close.svg" alt="" /></span>
        </div>
    </div>
    `;
}

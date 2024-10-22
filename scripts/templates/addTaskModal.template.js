function getAddTaskModalTemplate() {
  return /*html*/ `
    <div class="modal-overlay" id="add-task-modal">
        <div class="modal-content" id="modal-content">
            <span class="close-btn" onclick="closeAddTaskModal()"><img src="./assets/svg/close.svg" alt="" /></span>
        </div>
    </div>
    `;
}

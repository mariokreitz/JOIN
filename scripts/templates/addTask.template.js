/**
 * Returns the HTML template for the add task form.
 * @returns {String} The add task form template.
 */
function getAddTaskTemplate() {
  return /*html*/ `
  <div class="add-task-content">
        <h1 class="inter-medium">Add Task</h1>
        <div class="task-form-container">
          <div class="task-left">
            <div class="form-group">
              <label for="title">Title<span class="required">*</span></label>
              <input autocomplete="off" type="text" id="title" placeholder="Enter a title" required />
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea id="description" placeholder="Enter a Description"></textarea>
            </div>

            <div class="form-group custom-dropdown contact-dropdown">
              <label for="search">Assigned to</label>
              <div class="input-container">
                <input
                  autocomplete="off"
                  type="text"
                  id="search"
                  placeholder="Select contacts to assign"
                  onkeyup="filterContactOptions()"
                  onclick="toggleContactDropdown(event)" />
                <div id="dropdown-icon-container" class="icon-container dropdown-btn" onclick="toggleContactDropdown(event)">
                  <img src="./assets/svg/arrow-dropdown.svg" alt="dropdown icon" class="icon" id="dropdown-icon" />
                </div>
              </div>
              <ul id="contact-dropdown-options" class="options"></ul>
              <div id="selected-badges" class="selected-badges"></div>
            </div>
          </div>

          <div class="task-seperator"></div>

          <div class="task-right">
            <div class="form-group">
              <label for="due-date">Due date<span class="required">*</span></label>
              <div class="input-container">
                <input type="date" id="due-date" placeholder="dd/mm/yyyy" required />
                <div class="icon-container" onclick="openDatePicker(event)">
                  <img src="./assets/svg/event.svg" alt="date icon" class="icon" id="date-icon" />
                </div>
              </div>
            </div>

            <div class="form-group priority-group">
              <label>Prio</label>
              <div class="priority-actions">
                <button data-priority="high" onclick="handlePrioChange(event)" type="button" class="prio urgent">
                  Urgent
                  <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19.2597 15.4464C19.0251 15.4468 18.7965 15.3719 18.6077 15.2328L10.3556 9.14965L2.10356 15.2328C1.98771 15.3184 1.85613 15.3803 1.71633 15.4151C1.57652 15.4498 1.43124 15.4567 1.28877 15.4354C1.14631 15.414 1.00944 15.3648 0.885997 15.2906C0.762552 15.2164 0.654943 15.1186 0.569314 15.0029C0.483684 14.8871 0.421712 14.7556 0.386936 14.6159C0.352159 14.4762 0.345259 14.331 0.366629 14.1887C0.409788 13.9012 0.565479 13.6425 0.799451 13.4697L9.70356 6.89926C9.89226 6.75967 10.1208 6.68433 10.3556 6.68433C10.5904 6.68433 10.819 6.75967 11.0077 6.89926L19.9118 13.4697C20.0977 13.6067 20.2356 13.7988 20.3057 14.0186C20.3759 14.2385 20.3747 14.4749 20.3024 14.6941C20.2301 14.9133 20.0904 15.1041 19.9031 15.2391C19.7159 15.3742 19.4907 15.4468 19.2597 15.4464Z"
                      fill="#FF3D00" />
                    <path
                      d="M19.2597 9.69733C19.0251 9.69774 18.7965 9.62289 18.6077 9.48379L10.3556 3.40063L2.10356 9.48379C1.86959 9.6566 1.57651 9.72945 1.28878 9.68633C1.00105 9.6432 0.742254 9.48762 0.569318 9.25383C0.396382 9.02003 0.323475 8.72716 0.366634 8.43964C0.409793 8.15213 0.565483 7.89352 0.799455 7.72072L9.70356 1.15024C9.89226 1.01065 10.1208 0.935303 10.3556 0.935303C10.5904 0.935303 10.819 1.01065 11.0077 1.15024L19.9118 7.72072C20.0977 7.85763 20.2356 8.04974 20.3057 8.26962C20.3759 8.4895 20.3747 8.72591 20.3024 8.94509C20.2301 9.16427 20.0904 9.35503 19.9031 9.49012C19.7159 9.62521 19.4907 9.69773 19.2597 9.69733Z"
                      fill="#FF3D00" />
                  </svg>
                </button>
                <button data-priority="medium" onclick="handlePrioChange(event)" type="button" class="prio medium">
                  Medium
                  <svg width="21" height="8" viewBox="0 0 21 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19.7596 7.91693H1.95136C1.66071 7.91693 1.38197 7.80063 1.17645 7.59362C0.970928 7.3866 0.855469 7.10584 0.855469 6.81308C0.855469 6.52032 0.970928 6.23955 1.17645 6.03254C1.38197 5.82553 1.66071 5.70923 1.95136 5.70923H19.7596C20.0502 5.70923 20.329 5.82553 20.5345 6.03254C20.74 6.23955 20.8555 6.52032 20.8555 6.81308C20.8555 7.10584 20.74 7.3866 20.5345 7.59362C20.329 7.80063 20.0502 7.91693 19.7596 7.91693Z"
                      fill="#FFA800" />
                    <path
                      d="M19.7596 2.67376H1.95136C1.66071 2.67376 1.38197 2.55746 1.17645 2.35045C0.970928 2.14344 0.855469 1.86267 0.855469 1.56991C0.855469 1.27715 0.970928 0.996386 1.17645 0.789374C1.38197 0.582363 1.66071 0.466064 1.95136 0.466064L19.7596 0.466064C20.0502 0.466064 20.329 0.582363 20.5345 0.789374C20.74 0.996386 20.8555 1.27715 20.8555 1.56991C20.8555 1.86267 20.74 2.14344 20.5345 2.35045C20.329 2.55746 20.0502 2.67376 19.7596 2.67376Z"
                      fill="#FFA800" />
                  </svg>
                </button>
                <button data-priority="low" onclick="handlePrioChange(event)" type="button" class="prio low">
                  Low
                  <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10.8555 9.69779C10.6209 9.69819 10.3923 9.62335 10.2035 9.48427L1.30038 2.91453C1.18454 2.82898 1.0867 2.72146 1.01245 2.59812C0.938193 2.47478 0.888977 2.33803 0.867609 2.19569C0.824455 1.90821 0.897354 1.61537 1.07027 1.3816C1.24319 1.14782 1.50196 0.992265 1.78965 0.949143C2.07734 0.906021 2.3704 0.978866 2.60434 1.15165L10.8555 7.23414L19.1066 1.15165C19.2224 1.0661 19.354 1.00418 19.4938 0.969432C19.6336 0.934685 19.7788 0.927791 19.9213 0.949143C20.0637 0.970495 20.2006 1.01967 20.324 1.09388C20.4474 1.16808 20.555 1.26584 20.6407 1.3816C20.7263 1.49735 20.7883 1.62882 20.823 1.7685C20.8578 1.90818 20.8647 2.05334 20.8433 2.19569C20.822 2.33803 20.7727 2.47478 20.6985 2.59812C20.6242 2.72146 20.5264 2.82898 20.4106 2.91453L11.5075 9.48427C11.3186 9.62335 11.0901 9.69819 10.8555 9.69779Z"
                      fill="#7AE229" />
                    <path
                      d="M10.8555 15.4463C10.6209 15.4467 10.3923 15.3719 10.2035 15.2328L1.30038 8.66307C1.06644 8.49028 0.910763 8.2317 0.867609 7.94422C0.824455 7.65674 0.897354 7.3639 1.07027 7.13013C1.24319 6.89636 1.50196 6.7408 1.78965 6.69768C2.07734 6.65456 2.3704 6.7274 2.60434 6.90019L10.8555 12.9827L19.1066 6.90019C19.3405 6.7274 19.6336 6.65456 19.9213 6.69768C20.209 6.7408 20.4678 6.89636 20.6407 7.13013C20.8136 7.3639 20.8865 7.65674 20.8433 7.94422C20.8002 8.2317 20.6445 8.49028 20.4106 8.66307L11.5075 15.2328C11.3186 15.3719 11.0901 15.4467 10.8555 15.4463Z"
                      fill="#7AE229" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-group custom-dropdown category-dropdown">
              <label for="category">Category<span class="required">*</span></label>
              <div class="input-container">
                <div id="select-category" class="select-category" onclick="toggleCategoryDropdown(event)">
                  Select task category
                </div>
                <div class="icon-container dropdown-btn" onclick="toggleCategoryDropdown(event)">
                  <img
                    src="./assets/svg/arrow-dropdown.svg"
                    alt="dropdown icon"
                    class="icon"
                    id="category-dropdown-icon" />
                </div>
              </div>
              <ul id="category-dropdown-options" class="options">
                <li onclick="selectCategory(event, 'Technical Task')">Technical Task</li>
                <li onclick="selectCategory(event, 'User Story')">User Story</li>
              </ul>
            </div>

            <div class="form-group subtask">
              <label for="subtasks">Subtasks</label>
              <div class="input-container">
                <input
                  autocomplete="off"
                  type="text"
                  id="subtasks"
                  placeholder="Add new subtask"
                  oninput="updateSubtaskIcons()" />
                <div class="icon-container" onclick="focusInput()">
                  <img src="./assets/svg/add-icon.svg" alt="add icon" class="icon add-icon" id="add-icon" />
                </div>
                <div class="subtask-actions" id="subtask-actions">
                  <div class="icon-container" onclick="clearSubtaskInput()">
                    <img src="./assets/svg/close.svg" alt="cancel icon" class="icon cancel-icon" />
                  </div>
                  <div class="icon-seperator"></div>
                  <div class="icon-container" onclick="addSubtask()">
                    <img src="./assets/svg/check-mark-dark.svg" alt="confirm icon" class="icon confirm-icon" />
                  </div>
                </div>
              </div>
              <ul id="subtask-list"></ul>
            </div>
          </div>
        </div>
        <div class="form-actions-container">
          <p><span class="required">*</span>This field is required</p>
          <div class="form-actions">
            <button onclick="clearForm()" class="clear-btn">
              Clear
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.00005 8.40005L2.10005 13.3C1.91672 13.4834 1.68338 13.575 1.40005 13.575C1.11672 13.575 0.883382 13.4834 0.700049 13.3C0.516715 13.1167 0.425049 12.8834 0.425049 12.6C0.425049 12.3167 0.516715 12.0834 0.700049 11.9L5.60005 7.00005L0.700049 2.10005C0.516715 1.91672 0.425049 1.68338 0.425049 1.40005C0.425049 1.11672 0.516715 0.883382 0.700049 0.700049C0.883382 0.516715 1.11672 0.425049 1.40005 0.425049C1.68338 0.425049 1.91672 0.516715 2.10005 0.700049L7.00005 5.60005L11.9 0.700049C12.0834 0.516715 12.3167 0.425049 12.6 0.425049C12.8834 0.425049 13.1167 0.516715 13.3 0.700049C13.4834 0.883382 13.575 1.11672 13.575 1.40005C13.575 1.68338 13.4834 1.91672 13.3 2.10005L8.40005 7.00005L13.3 11.9C13.4834 12.0834 13.575 12.3167 13.575 12.6C13.575 12.8834 13.4834 13.1167 13.3 13.3C13.1167 13.4834 12.8834 13.575 12.6 13.575C12.3167 13.575 12.0834 13.4834 11.9 13.3L7.00005 8.40005Z"
                  fill="#2A3647"></path>
              </svg>
            </button>
            <button onclick="createTodo()" type="submit" class="create-btn">
              Create Task
              <img class="check-mark" src="./assets/svg/check-mark.svg" alt="" />
            </button>
          </div>
        </div>
      </div>
  `;
}

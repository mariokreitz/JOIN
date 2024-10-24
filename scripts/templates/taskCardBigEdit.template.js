function getTaskCardBigEditTemplate(todo, index) {
  return /* HTML */ `
    <div id="closeEditContainer" class="bigc-main-container inter-extralight">
      <div class="bc-close-container bc-with bc-m-left">
        <button onclick="openBigCardModal(${index})"><img src="./assets/img/icons/close.png" /></button>
      </div>
      <div clss="card-form-container" id="edit-card-form-container">
        <div class="form-group">
          <label for="title">Title<span class="required">*</span></label>
          <input autocomplete="off" type="text" id="bc-todo-titel" value="${todo.title}" required />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="bc-description-textarea" placeholder="Enter a Description">${todo.description}</textarea>
        </div>

        <div class="form-group">
          <label for="due-date">Due date<span class="required">*</span></label>
          <div class="input-container">
            <input type="date" id="due-date" value="${todo.date}" required />
            <div class="icon-container">
              <img src="./assets/svg/event.svg" alt="date icon" class="icon" id="date-icon" />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="">Priority</label>
          <div class="priority-actions">
            <div id="bc-select-urgent" class="bc-prio-select bc-prio-urgent" onclick="toggleUrgentState()">
              <span>Urgent</span>
              <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18.9199 14.6516C18.6853 14.652 18.4567 14.5772 18.2678 14.4381L10.0158 8.35491L1.76372 14.4381C1.64787 14.5236 1.51628 14.5856 1.37648 14.6203C1.23668 14.6551 1.0914 14.662 0.94893 14.6406C0.806462 14.6193 0.669598 14.5701 0.546153 14.4959C0.422708 14.4217 0.315099 14.3239 0.22947 14.2081C0.143841 14.0923 0.0818687 13.9609 0.0470921 13.8212C0.0123154 13.6815 0.00541523 13.5363 0.0267854 13.3939C0.0699445 13.1064 0.225635 12.8478 0.459607 12.675L9.36372 6.10452C9.55241 5.96493 9.78099 5.88959 10.0158 5.88959C10.2506 5.88959 10.4791 5.96493 10.6678 6.10452L19.5719 12.675C19.7579 12.8119 19.8957 13.004 19.9659 13.2239C20.036 13.4438 20.0349 13.6802 19.9626 13.8994C19.8903 14.1186 19.7505 14.3093 19.5633 14.4444C19.376 14.5795 19.1508 14.652 18.9199 14.6516Z"
                  fill="#FF3D00" />
                <path
                  d="M18.9199 8.9025C18.6853 8.90291 18.4567 8.82806 18.2678 8.68896L10.0158 2.6058L1.76372 8.68896C1.52975 8.86177 1.23666 8.93462 0.948935 8.8915C0.661208 8.84837 0.40241 8.69279 0.229474 8.459C0.0565387 8.2252 -0.0163691 7.93233 0.02679 7.64481C0.069949 7.3573 0.22564 7.09869 0.459611 6.92588L9.36372 0.355408C9.55242 0.215817 9.781 0.140472 10.0158 0.140472C10.2506 0.140472 10.4791 0.215817 10.6678 0.355408L19.5719 6.92588C19.7579 7.0628 19.8957 7.25491 19.9659 7.47479C20.036 7.69467 20.0349 7.93108 19.9626 8.15026C19.8903 8.36944 19.7505 8.5602 19.5633 8.69529C19.376 8.83038 19.1508 8.9029 18.9199 8.9025Z"
                  fill="#FF3D00" />
              </svg>
            </div>
            <div id="bc-select-medium" class="bc-prio-select bc-prio-medium" onclick="toggleMediumState()">
              <span>Medium</span
              ><svg width="21" height="9" viewBox="0 0 21 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19.0862 8.122H1.27802C0.987371 8.122 0.708627 8.00571 0.503108 7.79869C0.297588 7.59168 0.182129 7.31091 0.182129 7.01816C0.182129 6.7254 0.297588 6.44463 0.503108 6.23762C0.708627 6.0306 0.987371 5.91431 1.27802 5.91431H19.0862C19.3769 5.91431 19.6556 6.0306 19.8612 6.23762C20.0667 6.44463 20.1821 6.7254 20.1821 7.01816C20.1821 7.31091 20.0667 7.59168 19.8612 7.79869C19.6556 8.00571 19.3769 8.122 19.0862 8.122Z"
                  fill="#FFA800" />
                <path
                  d="M19.0862 2.87884H1.27802C0.987371 2.87884 0.708627 2.76254 0.503108 2.55553C0.297588 2.34852 0.182129 2.06775 0.182129 1.77499C0.182129 1.48223 0.297588 1.20146 0.503108 0.994452C0.708627 0.787441 0.987371 0.671143 1.27802 0.671143L19.0862 0.671143C19.3769 0.671143 19.6556 0.787441 19.8612 0.994452C20.0667 1.20146 20.1821 1.48223 20.1821 1.77499C20.1821 2.06775 20.0667 2.34852 19.8612 2.55553C19.6556 2.76254 19.3769 2.87884 19.0862 2.87884Z"
                  fill="#FFA800" />
              </svg>
            </div>
            <div id="bc-select-low" class="bc-prio-select bc-prio-low" onclick="toggleLowState()">
              <span>Low</span
              ><svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.8491 8.90286C10.6145 8.90327 10.386 8.82843 10.1971 8.68935L1.29403 2.11961C1.1782 2.03406 1.08036 1.92654 1.0061 1.8032C0.931846 1.67986 0.882629 1.54311 0.861261 1.40076C0.818107 1.11328 0.891007 0.820446 1.06392 0.586673C1.23684 0.352901 1.49561 0.197343 1.7833 0.154221C2.071 0.111099 2.36405 0.183944 2.598 0.356733L10.8491 6.43921L19.1002 0.356733C19.2161 0.271177 19.3477 0.209257 19.4874 0.17451C19.6272 0.139763 19.7725 0.132869 19.9149 0.154221C20.0574 0.175573 20.1942 0.224753 20.3177 0.298953C20.4411 0.373154 20.5487 0.470921 20.6343 0.586673C20.7199 0.702426 20.7819 0.833896 20.8167 0.973578C20.8514 1.11326 20.8583 1.25842 20.837 1.40076C20.8156 1.54311 20.7664 1.67986 20.6921 1.8032C20.6179 1.92654 20.52 2.03406 20.4042 2.11961L11.5011 8.68935C11.3123 8.82843 11.0837 8.90327 10.8491 8.90286Z"
                  fill="#7AE229" />
                <path
                  d="M10.8491 14.6514C10.6145 14.6518 10.386 14.577 10.1971 14.4379L1.29403 7.86815C1.06009 7.69536 0.904415 7.43678 0.861261 7.1493C0.818107 6.86182 0.891007 6.56898 1.06392 6.33521C1.23684 6.10144 1.49561 5.94588 1.7833 5.90276C2.071 5.85963 2.36405 5.93248 2.598 6.10527L10.8491 12.1877L19.1002 6.10527C19.3342 5.93248 19.6272 5.85963 19.9149 5.90276C20.2026 5.94588 20.4614 6.10144 20.6343 6.33521C20.8072 6.56898 20.8801 6.86182 20.837 7.1493C20.7938 7.43678 20.6382 7.69536 20.4042 7.86815L11.5011 14.4379C11.3123 14.577 11.0837 14.6518 10.8491 14.6514Z"
                  fill="#7AE229" />
              </svg>
            </div>
          </div>
        </div>

        <div class="form-group custom-dropdown contact-dropdown">
          <label>Assigned to</label>
          <div class="input-container">
            <input
              autocomplete="off"
              type="text"
              id="search"
              placeholder="Select contacts to assign"
              onkeyup="filterOptions()"
              onclick="toggleContactListDropdown(event)" />
            <div
              id="dropdown-icon-container"
              class="icon-container dropdown-btn"
              onclick="toggleContactListDropdown(event)">
              <img src="./assets/svg/arrow-dropdown.svg" alt="dropdown icon" class="icon" id="dropdown-icon" />
            </div>
          </div>
          <ul id="contact-dropdown-options" class="options"></ul>
          <div id="selected-badges" class="selected-badges"></div>
        </div>

        <div class="form-group subtask">
          <label for="subtasks">Subtasks</label>
          <div class="input-container">
            <input
              autocomplete="off"
              type="text"
              id="subtasks"
              placeholder="Add new subtask"
              oninput="handleSubtaskIcons()" />
            <div class="icon-container">
              <img src="./assets/svg/add-icon.svg" alt="add icon" class="icon add-icon" id="add-icon" />
            </div>
            <div class="subtask-actions" id="subtask-actions">
              <div class="icon-container" onclick="clearInputField()">
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

      <button onclick="editBigCard(${index})" class="bc-end-button">
        Ok<svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.23282 9.04673L14.7078 0.571728C14.9078 0.371729 15.1453 0.271729 15.4203 0.271729C15.6953 0.271729 15.9328 0.371729 16.1328 0.571728C16.3328 0.771728 16.4328 1.00923 16.4328 1.28423C16.4328 1.55923 16.3328 1.79673 16.1328 1.99673L6.93282 11.1967C6.73282 11.3967 6.49949 11.4967 6.23282 11.4967C5.96616 11.4967 5.73282 11.3967 5.53282 11.1967L1.23282 6.89673C1.03282 6.69673 0.936991 6.45923 0.945324 6.18423C0.953658 5.90923 1.05782 5.67173 1.25782 5.47173C1.45782 5.27173 1.69532 5.17173 1.97032 5.17173C2.24532 5.17173 2.48282 5.27173 2.68282 5.47173L6.23282 9.04673Z"
            fill="white" />
        </svg>
      </button>
    </div>
  `;
}

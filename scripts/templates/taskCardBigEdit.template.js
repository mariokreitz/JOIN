function getTaskCardBigEdit(todo, index) {
  const assignedMembersHtml = Object.keys(todo.assignedMembers)
    .map((key) => {
      const member = todo.assignedMembers[key];
      const initials = getInitialsFromContact({ name: member });
      const color = getAssignedMemberColor(member);
      return `
      <div class="assigned-member-initial-wrapper">
        <div class="bc-card-initial-circle" style="background-color: ${color};"><span>${initials}</span></div>
      </div>`;
    })
    .join("");

  return ` <div id="closeEditContainer" class="bigc-main-container">
      <div class="bc-close-container bc-with bc-m-left">
        <button onclick="closeBigCardEdit()"><img src="./assets/img/icons/close.png" /></button>
      </div>
      <div class="bc-head bc-m-left"><p>Title</p></div>
      <input id="bc-todo-titel" class="bc-m-left bc-title-input" type="text" value="${todo.title}" />
      <p class="bc-description-head bc-m-left">Description</p>
      <textarea class="bc-m-left" name="" id="bc-description-textarea">${todo.description}</textarea>
      <p class="bc-duedate-head bc-m-left">Due date:</p>
      <div class="bc-duedate-input-containr bc-with bc-m-left">
        <input id="bc-duedate-input" type="text" value="${formatDueDate(todo.date)}" />
        <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg" class="bc-icon">
          <path
            d="M12.1821 16.3967C11.4821 16.3967 10.8905 16.1551 10.4071 15.6717C9.9238 15.1884 9.68213 14.5967 9.68213 13.8967C9.68213 13.1967 9.9238 12.6051 10.4071 12.1217C10.8905 11.6384 11.4821 11.3967 12.1821 11.3967C12.8821 11.3967 13.4738 11.6384 13.9571 12.1217C14.4405 12.6051 14.6821 13.1967 14.6821 13.8967C14.6821 14.5967 14.4405 15.1884 13.9571 15.6717C13.4738 16.1551 12.8821 16.3967 12.1821 16.3967ZM2.68213 20.3967C2.13213 20.3967 1.6613 20.2009 1.26963 19.8092C0.877962 19.4176 0.682129 18.9467 0.682129 18.3967V4.39673C0.682129 3.84673 0.877962 3.3759 1.26963 2.98423C1.6613 2.59256 2.13213 2.39673 2.68213 2.39673H3.68213V1.39673C3.68213 1.1134 3.77796 0.875895 3.96963 0.684229C4.1613 0.492562 4.3988 0.396729 4.68213 0.396729C4.96546 0.396729 5.20296 0.492562 5.39463 0.684229C5.5863 0.875895 5.68213 1.1134 5.68213 1.39673V2.39673H13.6821V1.39673C13.6821 1.1134 13.778 0.875895 13.9696 0.684229C14.1613 0.492562 14.3988 0.396729 14.6821 0.396729C14.9655 0.396729 15.203 0.492562 15.3946 0.684229C15.5863 0.875895 15.6821 1.1134 15.6821 1.39673V2.39673H16.6821C17.2321 2.39673 17.703 2.59256 18.0946 2.98423C18.4863 3.3759 18.6821 3.84673 18.6821 4.39673V18.3967C18.6821 18.9467 18.4863 19.4176 18.0946 19.8092C17.703 20.2009 17.2321 20.3967 16.6821 20.3967H2.68213ZM2.68213 18.3967H16.6821V8.39673H2.68213V18.3967ZM2.68213 6.39673H16.6821V4.39673H2.68213V6.39673Z"
            fill="#2A3647" />
        </svg>
      </div>
      <p class="bc-priority-head bc-m-left">Priority</p>
      <div class="bc-priority-select-container bc-m-left bc-with">
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
      <p class="bc-assigned-head bc-m-left">Assigned to</p>
      <div class="dropdown-container">
        <div class="dropdown" id="dropdown" onclick="toggleAssignedDropdown()">
          <span>Select contacts to assign</span>
        </div>
        <div class="dropdown-content" id="dropdown-content">
          <div class="dropdown-item">
            <div class="bc-card-initial-circle-dropdown"><span>AM</span></div>
            <span class="name">Anna Müller</span>
            <input type="checkbox" onclick="handleSelection(this, 'AM', 'Anna Müller')" />
          </div>
          <div class="dropdown-item">
            <div class="bc-card-initial-circle-dropdown"><span>BM</span></div>
            <span class="name">Bernd Meyer</span>
            <input type="checkbox" onclick="handleSelection(this, 'BM', 'Bernd Meyer')" />
          </div>
          <div class="dropdown-item">
            <div class="bc-card-initial-circle-dropdown"><span>CM</span></div>
            <span class="name">Clara Meier</span>
            <input type="checkbox" onclick="handleSelection(this, 'CM', 'Clara Meier')" />
          </div>
        </div>
      </div>

      <div class="bc-show-selected-assigned bc-m-left bc-with" id="selected-assigned">
      ${assignedMembersHtml} 
      </div>
      <div class="bc-subtask-head bc-m-left"><p>Subtasks</p></div>

      <div class="bc-input-container bc-m-left">
        <input id="input-subtask-bc" class="bc-input-subtask" type="text" placeholder="Aufgabe hinzufügen" />
        <span onclick="addSubtaskBC()" class="bc-icon">+</span>
      </div>
      <div class="bc-subtask-list bc-with" id="show-subtask-bc">
      </div>
      <button onclick="editBigCard(${index})" class="bc-end-button">
        Ok<svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.23282 9.04673L14.7078 0.571728C14.9078 0.371729 15.1453 0.271729 15.4203 0.271729C15.6953 0.271729 15.9328 0.371729 16.1328 0.571728C16.3328 0.771728 16.4328 1.00923 16.4328 1.28423C16.4328 1.55923 16.3328 1.79673 16.1328 1.99673L6.93282 11.1967C6.73282 11.3967 6.49949 11.4967 6.23282 11.4967C5.96616 11.4967 5.73282 11.3967 5.53282 11.1967L1.23282 6.89673C1.03282 6.69673 0.936991 6.45923 0.945324 6.18423C0.953658 5.90923 1.05782 5.67173 1.25782 5.47173C1.45782 5.27173 1.69532 5.17173 1.97032 5.17173C2.24532 5.17173 2.48282 5.27173 2.68282 5.47173L6.23282 9.04673Z"
            fill="white" />
        </svg>
      </button>
    </div>`;
}

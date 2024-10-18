function toggleUrgentState() {
  resetAllStates();
  const container = document.getElementById("bc-select-urgent");
  container.classList.toggle("active");
}

function toggleMediumState() {
  resetAllStates();
  const container = document.getElementById("bc-select-medium");
  container.classList.toggle("active");
}

function toggleLowState() {
  resetAllStates();
  const container = document.getElementById("bc-select-low");
  container.classList.toggle("active");
}

function resetAllStates() {
  const containers = document.querySelectorAll(".bc-prio-select");
  containers.forEach((container) => {
    container.classList.remove("active");
  });
}

function addSubtaskBC() {
  const inputRef = document.getElementById("input-subtask-bc");
  const subtaskRenderContainer = document.getElementById("show-subtask-bc");
  const subtask = inputRef.value.trim();

  if (subtask) {
    subtaskRenderContainer.innerHTML += `<p>• ${subtask}</p>`;
    inputRef.value = "";
  }
}

function toggleAssignedDropdown() {
  const dropdownContent = document.getElementById("dropdown-content");
  if (dropdownContent.style.display === "block") {
    dropdownContent.style.display = "none";
  } else {
    dropdownContent.style.display = "block";
  }
}

function closeDropdown(event) {
  if (!event.target.matches(".dropdown")) {
    const dropdownContent = document.getElementById("dropdown-content");
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    }
  }
}

const handleSelection = (checkbox, initials) => {
  const selectedAssignedContainer = document.getElementById("selected-assigned");
  const existing = selectedAssignedContainer.querySelector(`[data-initials="${initials}"]`);

  if (checkbox.checked) {
    selectedAssignedContainer.innerHTML += `<div class="bc-card-initial-circle" data-initials="${initials}"><span>${initials}</span></div>`;
  } else {
    if (existing) {
      existing.remove();
    }
  }
};

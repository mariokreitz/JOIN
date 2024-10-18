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
    if (subtaskRenderContainer.innerHTML === "") {
      subtaskRenderContainer.innerHTML = "<ul></ul>";
    }
  }

  subtaskRenderContainer.innerHTML += <li>${subtask}</li>;
  subtask = "";
}

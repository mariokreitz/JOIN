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

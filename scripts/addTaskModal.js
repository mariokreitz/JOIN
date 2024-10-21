function loadScripts(scripts, callback) {
  let loadedScripts = 0;

  scripts.forEach((src) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      loadedScripts++;

      if (loadedScripts === scripts.length) {
        callback();
      }
    };
    document.head.appendChild(script);
  });
}

function openAddTaskModal() {
  document.body.insertAdjacentHTML("beforeend", getAddTaskModalTemplate());

  const scriptsToLoad = [
    "./scripts/addTask.js",
    "./scripts/templates/subtaskListItem.js",
    "./scripts/templates/contactlistDropdown.template.js",
    "./scripts/templates/addTask.template.js",
  ];

  loadScripts(scriptsToLoad, () => {
    document.getElementById("modal-content").innerHTML += getAddTaskTemplate();
    renderContactDropdown();
    applyAnimation("slide-in");
  });
}

function closeAddTaskModal() {
  const modal = document.getElementById("add-task-modal");
  if (modal) {
    modal.remove();
  }
}

function applyAnimation(animationType) {
  const modalContent = document.getElementById("modal-content");
  modalContent.style.animation = `${animationType} 0.3s ease-out forwards`;
}

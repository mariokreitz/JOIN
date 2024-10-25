function loadScripts(scripts, callback) {
  let loadedScripts = 0;

  scripts.forEach((src) => {
    if (!document.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        loadedScripts++;
        if (loadedScripts === scripts.length) {
          callback();
        }
      };
      document.head.appendChild(script);
    } else {
      loadedScripts++;
    }
  });
}

function openAddTaskModal(state = "todo") {
  globalState = state;
  if (window.innerWidth <= 768) {
    window.location.href = "/add-task.html";
  } else {
    document.body.style.overflow = "hidden";
    document.body.insertAdjacentHTML("beforeend", getAddTaskModalTemplate());
    const scriptsToLoad = [
      "./scripts/addTask.js",
      "./scripts/templates/subtaskListItem.js",
      "./scripts/templates/contactlistDropdown.template.js",
      "./scripts/templates/addTask.template.js",
    ];

    loadScripts(scriptsToLoad, () => {
      document.getElementById("modal-content").innerHTML += getAddTaskTemplate();
      setDefaultPriority();
      renderContactDropdown();
      applyAnimation("slide-in");
      restrictPastDatePick();
    });
  }
}

function closeAddTaskModal(event) {
  if (event) event.preventDefault();

  const modal = document.getElementById("add-task-modal");
  if (modal) {
    applyAnimation("slide-out");
    modal.addEventListener("animationend", () => {
      document.removeEventListener("click", outsideClickListenerWrapper);
      document.removeEventListener("click", outsideClickListenerWrapperCategory);

      document.removeEventListener("click", (e) =>
        outsideClickListener(e, "contact-dropdown-options", "dropdown-icon")
      );
      document.removeEventListener("click", (e) =>
        outsideClickListener(e, "category-dropdown-options", "category-dropdown-icon")
      );
      document.body.style.overflow = "auto";
      modal.remove();

      const scriptsToUnload = [
        "./scripts/addTask.js",
        "./scripts/templates/subtaskListItem.js",
        "./scripts/templates/contactlistDropdown.template.js",
        "./scripts/templates/addTask.template.js",
      ];

      scriptsToUnload.forEach((src) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          existingScript.parentNode.removeChild(existingScript);
        }
      });
    });
  }
}

function applyAnimation(animationType) {
  const modalContent = document.getElementById("modal-content");
  modalContent.style.animation = `${animationType} 0.3s ease-out forwards`;
}

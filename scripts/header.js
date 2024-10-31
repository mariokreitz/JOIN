/**
 * Toggles the display of the profile menu.
 *
 * The profile menu is a dropdown menu that displays when the user clicks on their
 * avatar or name in the header. It is hidden by default and can be shown by
 * clicking on the avatar or name, or by pressing the 'Escape' key.
 *
 * @returns {void}
 */
function openProfileMenu() {
  const profileMenu = document.getElementById("profile-menu");
  profileMenu.classList.toggle("d_none");
}

/**
 * Logs the user out by removing the user data from local storage and redirecting
 * to the login page after a 500ms delay.
 */
function logout() {
  localStorage.removeItem("currentUser");
  setTimeout(() => {
    window.location.href = "/login.html";
  }, 500);
}

/**
 * Listens for a click event on the document and checks if the profile menu is
 * visible and if the target of the event is not the profile menu or its toggler.
 * If the conditions are met, the profile menu is hidden.
 *
 * @listens document#click
 * @param {{ target: HTMLElement }} event - The event object from the click event
 * @returns {void}
 */
document.addEventListener("click", ({ target }) => {
  const profileMenu = document.getElementById("profile-menu");
  const toggler = document.getElementById("profile-menu-toggler");

  if (
    !profileMenu.classList.contains("d_none") &&
    !profileMenu.contains(target) &&
    target !== toggler &&
    !toggler.contains(target)
  ) {
    profileMenu.classList.add("d_none");
  }

  if (currentlyOpenMenu && !currentlyOpenMenu.contains(target)) {
    currentlyOpenMenu.classList.add("d_none");
    currentlyOpenMenu = null;
  }
});

/**
 * Goes back to the previous page in the browser's history or closes the current tab if the user is not logged in and the history is empty.
 *
 * @returns {void}
 */
function goBack() {
  const { isLoggedIn } = currentUser;

  if (!isLoggedIn && window.history.length <= 1) window.close();
  else window.history.back();
}

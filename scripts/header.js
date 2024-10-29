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

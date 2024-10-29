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

/**
 * Toggles the visibility of the login password visibility icon based on whether
 * or not there is a value in the password field. If there is a value, the icon
 * shows as a visibility icon and is clickable to change the password to be
 * visible. If there is no value, the icon shows as a default login icon and
 * is not clickable.
 *
 * @returns {void}
 */
function togglePasswordVisibilityIcon() {
  const passwordField = document.getElementById("password");
  const visibilityIcon = document.getElementById("login-change-pw-icon");

  if (passwordField.value.trim() !== "") {
    visibilityIcon.classList.add("login-pw-non-visibility");
    visibilityIcon.classList.remove("login-svg");
    visibilityIcon.onclick = changeVisibilityIcon;
  } else {
    visibilityIcon.classList.add("login-svg");
    visibilityIcon.classList.remove("login-pw-non-visibility");
    visibilityIcon.onclick = null;
  }
}

/**
 * Changes the type of the login password field between "password" and "text" based
 * on the current type. If the type is "password", it changes to "text" and changes
 * the visibility icon to be a visibility icon. If the type is "text", it changes to
 * "password" and changes the visibility icon to be a non-visibility icon.
 *
 * @returns {void}
 */
function changeVisibilityIcon() {
  const passwordInput = document.getElementById("password");
  const visibilityIcon = document.getElementById("login-change-pw-icon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    visibilityIcon.classList.replace("login-pw-non-visibility", "login-pw-visibility");
  } else {
    passwordInput.type = "password";
    visibilityIcon.classList.replace("login-pw-visibility", "login-pw-non-visibility");
  }
}
/**
 * Toggles the "Remember Me" checkbox and its associated icon. If the icon currently
 * shows a checked box, it will change to an unchecked box and the checkbox value
 * will be set to "false". If the icon currently shows an unchecked box, it will
 * change to a checked box and the checkbox value will be set to "true".
 *
 * @returns {void}
 */
function toggleRememberMe() {
  const rememberMeIcon = document.getElementById("loginRememberMe");
  const rememberMeLabel = document.getElementById("rememberMeLabel");

  const isChecked = rememberMeIcon.src.includes("subtask-checked.svg");
  rememberMeIcon.src = isChecked ? "./assets/svg/subtask-non-checked.svg" : "./assets/svg/subtask-checked.svg";

  rememberMeLabel.dataset.checked = isChecked ? "false" : "true";
}

/**
 * Changes the type of the confirm password field between "password" and "text" based
 * on the current type. If the type is "password", it changes to "text" and changes
 * the visibility icon to be a visibility icon. If the type is "text", it changes to
 * "password" and changes the visibility icon to be a non-visibility icon.
 *
 * @returns {void}
 */
function toggleConfirmPasswordVisibility() {
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const confirmToggleIcon = document.getElementById("login-change-pw-icon-double");

  if (confirmPasswordInput.type === "password") {
    confirmPasswordInput.type = "text";
    confirmToggleIcon.classList.replace("login-pw-non-visibility", "login-pw-visibility");
  } else {
    confirmPasswordInput.type = "password";
    confirmToggleIcon.classList.replace("login-pw-visibility", "login-pw-non-visibility");
  }
}

/**
 * Toggles the visibility of the confirm password icon based on whether the
 * confirm password field has any input. If the field has any input, the icon
 * is changed to the visibility icon and the icon is made clickable to change
 * the password to be visible. If the field is empty, the icon is changed to the
 * default icon and the icon is made unclickable.
 *
 * @returns {void}
 */
function toggleConfirmPasswordVisibilityIcon() {
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const confirmToggleIcon = document.getElementById("login-change-pw-icon-double");

  if (confirmPasswordInput.value.trim() !== "") {
    confirmToggleIcon.classList.remove("login-svg-confirmed");
    confirmToggleIcon.classList.add("login-pw-non-visibility");
    confirmToggleIcon.onclick = toggleConfirmPasswordVisibility;
  } else {
    confirmToggleIcon.classList.remove("login-pw-non-visibility");
    confirmToggleIcon.classList.add("login-svg-confirmed");
    confirmToggleIcon.onclick = null;
  }
}

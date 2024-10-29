/**
 * Initializes the login form by loading and filling in the login form
 * with any remembered login credentials.
 */
function init() {
  const rememberedCredentials = checkAndLoadUserCredentialsFromLocalStorage();
  fillCredentialsInLoginForm(rememberedCredentials);
}

/**
 * Handles the login process, given a flag indicating whether
 * the user should be logged in as a guest or not.
 *
 * @param {boolean} isGuest - Whether the user should be logged in as a guest or not.
 *
 * @returns {Promise<void>} A promise that resolves when the login process is finished.
 */

async function handleLogin(isGuest) {
  const demoCredentials = {
    email: "demo@join.com",
    password: "1234567",
  };

  const credentials = isGuest ? demoCredentials : getCredentialsFromForm();
  fillCredentialsInLoginForm(credentials);

  if (!validateLoginFormData(credentials)) return;

  try {
    const { status, user: fetchedUser, statusText } = await getUserFromFirebaseDatabase(credentials);
    switch (status) {
      case 400:
        document.getElementById("emailError").innerText = statusText;
        break;
      case 401:
        document.getElementById("passwordError").innerText = statusText;
        break;
      case 404:
        showToastMessage("error", { ok: false });
        break;
      case 200:
        Object.assign(currentUser, fetchedUser);
        saveCurrentUserToLocalStorage();
        checkAndSaveUserCredentialsToLocalStorage();
        showToastMessage("loginSuccess", { ok: true });
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
        break;
      default:
        break;
    }
  } catch (error) {
    showToastMessage("error", { ok: false });
  }
}

/**
 * Retrieves the user's email and password input values from the login form.
 * The values are trimmed of any leading or trailing whitespace.
 *
 * @returns {Object} An object containing the email and password.
 */
function getCredentialsFromForm() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  return {
    email: emailInput.value.trim(),
    password: passwordInput.value.trim(),
  };
}
/**
 * Checks if the "Remember Me" option is selected and saves the user credentials
 * to local storage if it is. The credentials are retrieved from the login form,
 * and an additional "isRememberMe" flag is added to indicate the selection status.
 */
function checkAndSaveUserCredentialsToLocalStorage() {
  const rememberMeElement = document.getElementById("rememberMeLabel");
  const isRememberMeChecked = rememberMeElement.dataset.checked === "true";

  if (isRememberMeChecked) {
    const userCredentials = getCredentialsFromForm();
    userCredentials.isRememberMe = isRememberMeChecked;
    saveUserCredentialsToLocalStorage(userCredentials);
  }
}

/**
 * Checks and loads user credentials from local storage if the "Remember Me" option was selected.
 * Updates the "Remember Me" icon to indicate the selection status.
 *
 * @returns {Object} An object containing the email and password if credentials are found and the
 * "Remember Me" option is enabled; otherwise, returns an object with empty strings for email and password.
 */
function checkAndLoadUserCredentialsFromLocalStorage() {
  const storedUser = loadUserCredentialsFromLocalStorage();
  if (storedUser && storedUser.isRememberMe) {
    const rememberMeIcon = document.getElementById("loginRememberMe");
    rememberMeIcon.src = "./assets/img/icons/subtask-checked.png";
    return { email: storedUser.email, password: storedUser.password };
  }
  return { email: "", password: "" };
}

/**
 * Fills in the login form with the provided credentials.
 *
 * @param {Object} credentials - The object containing the email and password
 * to fill in the form with.
 * @param {string} credentials.email - The email to fill in the form with.
 * @param {string} credentials.password - The password to fill in the form with.
 */
function fillCredentialsInLoginForm({ email, password }) {
  const emailInputField = document.getElementById("email");
  const passwordInputField = document.getElementById("password");

  emailInputField.value = email;
  passwordInputField.value = password;
}

function validateLoginFormData() {
  const emailErrorElement = document.getElementById("emailError");
  const passwordErrorElement = document.getElementById("passwordError");

  emailErrorElement.textContent = "";
  passwordErrorElement.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  let isValid = true;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    emailErrorElement.textContent = "Please enter a valid email address.";
    isValid = false;
  }

  if (password.length < 7) {
    passwordErrorElement.textContent = "The password must be at least 7 characters long.";
    isValid = false;
  }

  return isValid;
}

function toggleLoginIconVisibility() {
  const passwordInput = document.getElementById("password");
  const loginIconDiv = document.getElementById("login-change-pw-icon");

  if (passwordInput.value.trim() !== "") {
    loginIconDiv.classList.remove("login-svg");
    loginIconDiv.classList.add("login-pw-non-visibility");
    loginIconDiv.onclick = changeVisibilityIcon;
  } else {
    loginIconDiv.classList.remove("login-pw-non-visibility");
    loginIconDiv.classList.add("login-svg");
    loginIconDiv.onclick = null;
  }
}

function changeVisibilityIcon() {
  const passwordInput = document.getElementById("password");
  const loginIconDiv = document.getElementById("login-change-pw-icon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    loginIconDiv.classList.remove("login-pw-non-visibility");
    loginIconDiv.classList.add("login-pw-visibility");
  } else {
    passwordInput.type = "password";
    loginIconDiv.classList.remove("login-pw-visibility");
    loginIconDiv.classList.add("login-pw-non-visibility");
  }
}

function loginRemember() {
  const rememberMeImage = document.getElementById("loginRememberMe");
  const rememberMeLabel = document.getElementById("rememberMeLabel");

  if (rememberMeImage.src.includes("subtask-checked.png")) {
    rememberMeImage.src = "./assets/img/icons/subtask-non-checked.png";
    rememberMeLabel.dataset.checked = "false";
  } else {
    rememberMeImage.src = "./assets/img/icons/subtask-checked.png";
    rememberMeLabel.dataset.checked = "true";
  }
}

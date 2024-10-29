/**
 * Handles the login process, by retrieving the user credentials from the form or
 * demo credentials, validating the form data, getting the user from the Firebase
 * Realtime Database and then logging in the user.
 *
 * @param {boolean} isGuest determines whether the demo credentials should be used
 * @returns {Promise<void>}
 */
async function handleLogin(isGuest) {
  const demoCredentials = {
    email: "demo@join.com",
    password: "1234567",
  };
  const credentials = isGuest ? demoCredentials : getCredentialsFromForm();
  if (isGuest) fillDemoCredentialsInLoginForm(credentials);

  if (!validateLoginFormData(credentials)) return;

  try {
    const { status, user: fetchedUser } = await getUserFromFirebaseDatabase(credentials);
    switch (status) {
      case 404:
        showToastMessage("error", { ok: false });
        break;
      case 200:
        Object.assign(currentUser, fetchedUser);
        saveUserToLocalStorage();
        checkAndSaveUserToLocalStorage();
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
 * Checks if the "Remember Me" checkbox is checked and saves the user
 * data to local storage if it is.
 */
function checkAndSaveUserToLocalStorage() {
  const rememberMeLabelElement = document.getElementById("rememberMeLabel");
  const isRememberMeChecked = rememberMeLabelElement.dataset.checked === "true";

  if (isRememberMeChecked) {
    saveUserToLocalStorage();
  }
}

/**
 * Fills in the login form with the demo user's email and password.
 * @param {Object} credentials - An object containing the email and password of the demo user.
 */
function fillDemoCredentialsInLoginForm({ email, password }) {
  const emailInputField = document.getElementById("email");
  const passwordInputField = document.getElementById("password");

  emailInputField.value = email;
  passwordInputField.value = password;
}

function setLogoFinalPosition() {
  const logo = document.getElementById("login-logo");
  logo.style.width = "90px";
  logo.style.height = "110px";
  logo.style.left = "60px";
  logo.style.top = "55px";
  document.getElementById("overlay").style.display = "none";
  document.body.style.overflow = "auto";
}

function triggerLogoAnimation() {
  const overlay = document.getElementById("overlay");
  if (document.referrer.includes("signup.html")) {
    setLogoFinalPosition();
    return;
  }
  document.body.style.overflow = "hidden";
  setTimeout(() => {
    overlay.classList.add("fade-out");
    const logo = document.getElementById("login-logo");
    logo.classList.add("logo-animate");

    setTimeout(() => {
      overlay.style.display = "none";
      document.body.style.overflow = "auto";
    }, 1000);
  }, 2000);
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

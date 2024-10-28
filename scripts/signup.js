function loginRemember() {
  const rememberMeImage = document.getElementById("loginRememberMe");

  if (rememberMeImage.src.includes("subtask-checked.png")) {
    rememberMeImage.src = "./assets/img/icons/subtask-non-checked.png";
    document.getElementById("sign-login-btn").disabled = true;
  } else {
    rememberMeImage.src = "./assets/img/icons/subtask-checked.png";
    document.getElementById("sign-login-btn").disabled = false;
  }
}

function validateForm() {
  document.getElementById("nameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("passwordError").textContent = "";
  document.getElementById("passwordDoubleError").textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  let isValid = true;

  const namePattern = /^[A-Za-z]+(-[A-Za-z]+)? [A-Za-z]+(-[A-Za-z]+)?$/;
  if (!namePattern.test(name)) {
    document.getElementById("nameError").textContent = "Please enter a valid name.";
    isValid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    document.getElementById("emailError").textContent = "Please enter a valid email address.";
    isValid = false;
  }

  if (password.length < 7) {
    document.getElementById("passwordError").textContent = "The password must be at least 7 characters long.";
    isValid = false;
  }

  if (password !== confirmPassword) {
    document.getElementById("passwordDoubleError").textContent = "The passwords do not match.";
    isValid = false;
  }
}

// DIESE CODES SIND PROTOYPEN!
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

function toggleLoginIconVisibilityDouble() {
  const passwordInput = document.getElementById("confirmPassword");
  const loginIconDiv = document.getElementById("login-change-pw-icon-double");

  if (passwordInput.value.trim() !== "") {
    loginIconDiv.classList.remove("login-svg-confirmed");
    loginIconDiv.classList.add("login-pw-non-visibility");
    loginIconDiv.onclick = changeVisibilityIconConfirmed;
  } else {
    loginIconDiv.classList.remove("login-pw-non-visibility");
    loginIconDiv.classList.add("login-svg-confirmed");
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

function changeVisibilityIconConfirmed() {
  const passwordInput = document.getElementById("confirmPassword");
  const loginIconDiv = document.getElementById("login-change-pw-icon-double");

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

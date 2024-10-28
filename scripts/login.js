function validateForm() {
  document.getElementById("emailError").textContent = "";
  document.getElementById("passwordError").textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  let isValid = true;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    document.getElementById("emailError").textContent = "Please enter a valid email address.";
    isValid = false;
  }

  if (password.length < 7) {
    document.getElementById("passwordError").textContent = "The password must be at least 7 characters long.";
    isValid = false;
  }
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

  if (rememberMeImage.src.includes("subtask-checked.png")) {
    rememberMeImage.src = "./assets/img/icons/subtask-non-checked.png";
  } else {
    rememberMeImage.src = "./assets/img/icons/subtask-checked.png";
  }
}

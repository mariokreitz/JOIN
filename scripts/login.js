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
  } else {
    loginIconDiv.classList.remove("login-pw-non-visibility");
    loginIconDiv.classList.add("login-svg");
  }
}

document.getElementById("password").addEventListener("input", toggleLoginIconVisibility);

function loginRemember() {
  const rememberMeImage = document.getElementById("loginRememberMe");

  if (rememberMeImage.src.includes("subtask-checked.png")) {
    rememberMeImage.src = "./assets/img/icons/subtask-non-checked.png";
  } else {
    rememberMeImage.src = "./assets/img/icons/subtask-checked.png";
  }
}

function validateForm() {
  document.getElementById("nameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("passwordError").textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
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
}

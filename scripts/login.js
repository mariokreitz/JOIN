function validateForm() {
  document.getElementById("emailError").textContent = "";
  document.getElementById("passwordError").textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  let isValid = true;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    document.getElementById("emailError").textContent = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    isValid = false;
  }

  if (password.length < 7) {
    document.getElementById("passwordError").textContent = "Das Passwort muss mindestens 7 Zeichen lang sein.";
    isValid = false;
  }

  if (isValid) {
    alert("Anmeldung erfolgreich!");
  }
}

/**
 * Toggles the state of the privacy policy checkbox and enables/disables
 * the sign-up button accordingly. The checkbox image source is switched
 * between checked and non-checked states, and the sign-up button is
 * disabled if the checkbox is unchecked.
 */
function togglePrivacyPolicyCheckbox() {
  const privacyPolicyCheckbox = document.getElementById("privacy-policy-checkbox");
  const signUpButton = document.getElementById("sign-login-btn");

  const isChecked = privacyPolicyCheckbox.src.includes("subtask-checked.svg");

  privacyPolicyCheckbox.src = isChecked ? "./assets/svg/subtask-non-checked.svg" : "./assets/svg/subtask-checked.svg";

  signUpButton.disabled = isChecked;
}

/**
 * Handles the sign up process, by validating the form data, creating a new user
 * object and adding it to the Firebase Realtime Database. The function first
 * retrieves the form data, validates it, creates a new user object by spreading
 * the form data and adds the current timestamp for createdAt. The function then
 * calls putDataInFirebase to add the user to the database and shows a toast
 * message with the status of the operation. Finally, the function closes the
 * contact modal, renders the contacts page and selects the latest created
 * contact.
 *
 * @returns {Promise<void>}
 */
async function signUp() {
  if (!validateForm()) return;
  const [name, email, password] = getFormValues();

  const user = {
    name,
    email,
    password,
    isLoggedIn: false,
    contacts: "guest",
  };
  const response = await createUserInFirebaseDatabase(user);
  switch (response.status) {
    case 200:
      showToastMessage("signUpSuccess", response);
      setTimeout(() => {
        window.location.href = "./login.html";
      }, 1000);
      break;
    case 400:
      showToastMessage("signUpExists", response);
      break;
    case 404:
      showToastMessage("error", response);
      break;
    default:
      break;
  }
}

/**
 * Validates the sign-up form fields by checking if the name, email,
 * password, and confirm password inputs meet specific requirements.
 * Updates the respective error message fields if validation fails.
 *
 * @returns {boolean} Always returns true after validation.
 */
function validateForm() {
  const [name, email, password, confirmPassword] = getFormValues();

  const nameRegex = /^[A-Za-z]+(-[A-Za-z]+)? [A-Za-z]+(-[A-Za-z]+)?$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,}$/;

  clearErrorMessages();

  let isValid = true;

  if (!nameRegex.test(name)) {
    document.getElementById("nameError").textContent = "Please enter a valid name.";
    isValid = false;
  }

  if (!emailRegex.test(email)) {
    document.getElementById("emailError").textContent = "Please enter a valid email address.";
    isValid = false;
  }

  if (!passwordRegex.test(password)) {
    document.getElementById("passwordError").textContent =
      "Password must contain at least 7 characters, uppercase and lowercase letters, number and one of !@#$%^&*.";
    isValid = false;
  }

  if (password !== confirmPassword) {
    document.getElementById("passwordDoubleError").textContent = "The passwords do not match.";
    isValid = false;
  }

  return isValid;
}
/**
 * Retrieves the values of the sign-up form fields and returns them in an array.
 * The array contains the name, email, password, and confirm password values in
 * that order. The values are retrieved from the DOM using the ids of the input
 * fields and trimmed of any whitespace.
 *
 * @returns {Array<string>} The values of the sign-up form fields.
 */
function getFormValues() {
  return ["name", "email", "password", "confirmPassword"].map((id) => document.getElementById(id).value.trim());
}

/**
 * Clears the error messages displayed in the sign-up form by setting the textContent
 * of the elements with ids "nameError", "emailError", "passwordError", and
 * "passwordDoubleError" to an empty string.
 */
function clearErrorMessages() {
  const errorFields = ["nameError", "emailError", "passwordError", "passwordDoubleError"];
  errorFields.forEach((id) => {
    document.getElementById(id).textContent = "";
  });
}

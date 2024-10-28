/**
 * Shows a toast message based on the operation type and the response.
 *
 * @param {string} operation - The type of operation. Can be either "create" or "update".
 * @param {Response} response - The response object from the fetch API.
 * @returns {void}
 */
const textContent = {
  /**
   * The text content for the create operation.
   * @type {string}
   */
  create: "Contact succesfully created ",
  /**
   * The text content for the update operation.
   * @type {string}
   */
  update: "Contact details updated ",
  /**
   * The text content for the delete operation.
   * @type {string}
   */
  delete: "Contact deleted ",
  /**
   * The text content for the task added operation.
   * @type {string}
   */
  taskAdded: `Task added to board <img src="./assets/svg/board-icon.svg">`,
  /**
   * The text content for the login success operation.
   * @type {string}
   */
  loginSuccess: "You Logged In successfully",
  /**
   * The text content for when something went wrong.
   * @type {string}
   */
  error: "Something went wrong",
  /**
   * The text content for when a contact already exists.
   * @type {string}
   */
  exists: "Email/Phone already exists",
  /**
   * The text content for the todo deleted operation.
   * @type {string}
   */
  todoDeleted: "Todo successfully deleted",
  /**
   * The text content for the todo updated operation.
   * @type {string}
   */
  todoUpdated: "Todo successfully updated",
  /**
   * The text content for the sign up success operation.
   * @type {string}
   */
  signUpSuccess: "You Signed Up successfully",
  /**
   * The text content for when a user already exists while signing up.
   * @type {string}
   */
  signUpExists: "Email already exists",
};

/**
 * Displays a toast message based on the operation and response status.
 *
 * Generates an HTML toast message using the appropriate text content
 * for the provided operation and appends it to the document body.
 * The toast message is automatically removed after a set timeout.
 * If the operation requires a redirect and the conditions are met,
 * the user is redirected to the board page.
 *
 * @param {string} operation - The operation type used to determine the message text.
 * @param {Object} response - The response object containing the status of the operation.
 */
function showToastMessage(operation, response) {
  const message = response.ok ? textContent[operation] : textContent.error;
  const toastMessageHTML = getToastMessageTemplate(message);

  document.body.insertAdjacentHTML("beforeend", toastMessageHTML);
  setTimeout(() => {
    document.querySelector(".toast-message-box").remove();

    if (shouldRedirect("taskAdded")) window.location.href = "/board.html";
  }, 1600);
}

/**
 * Determines whether a redirect to the board page is necessary.
 *
 * This function checks if the current operation is "taskAdded" and if
 * the user is on the "add-task" page. If both conditions are true, it
 * returns true, indicating that a redirect should occur.
 *
 * @param {string} operation - The operation type to check against.
 * @returns {boolean} True if a redirect should occur, false otherwise.
 */
function shouldRedirect(operation) {
  return operation === "taskAdded" && window.location.pathname === "/add-task.html";
}

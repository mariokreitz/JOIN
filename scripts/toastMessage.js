/**
 * Contains the text content for each operation type.
 * @typedef {Object.<string, string>} TextContent
 * @property {string} create - The text content for the create operation.
 * @property {string} update - The text content for the update operation.
 * @property {string} delete - The text content for the delete operation.
 * @property {string} taskAdded - The text content for the task added operation.
 * @property {string} signUpSuccess - The text content for the sign up success operation.
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
  taskAdded: "Task added to board",
  /**
   * The text content for the sign up success operation.
   * @type {string}
   */
  signUpSuccess: "You Signed Up successfully",
};

/**
 * Shows a toast message to the user for a given operation and response object.
 * If the response status is 200, a success message is shown, otherwise an error
 * message is shown. The message is displayed for 1.6 seconds and then removed.
 * @param {string} operation - The name of the operation. Should match one of the
 *   properties of the textContent object.
 * @param {Response} response - The response object from the fetch call.
 */
function showToastMessage(operation, response) {
  const message = response.ok ? textContent[operation] : "Something went wrong";
  const toastMessageHTML = getToastMessageTemplate(message);
  document.body.insertAdjacentHTML("beforeend", toastMessageHTML);
  setTimeout(() => {
    const toastMessageElement = document.querySelector(".toast-message-box");
    toastMessageElement.remove();
  }, 1600);
}

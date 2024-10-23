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
  taskAdded: "Task added to board",
  /**
   * The text content for the sign up success operation.
   * @type {string}
   */
  signUpSuccess: "You Signed Up successfully",
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
};

/**
 * Shows a toast message based on the operation type and the response.
 * @param {string} operation - The type of operation.
 * @param {Response} response - The response object from the fetch API.
 * @returns {void}
 */
function showToastMessage(operation, response) {
  const message = response.ok ? textContent[operation] : textContent["error"];
  const toastMessageHTML = getToastMessageTemplate(message);
  document.body.insertAdjacentHTML("beforeend", toastMessageHTML);
  setTimeout(() => {
    const toastMessageElement = document.querySelector(".toast-message-box");
    toastMessageElement.remove();
  }, 1600);
}

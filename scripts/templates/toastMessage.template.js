/**
 * Returns an HTML string representing a toast message box, given a text.
 *
 * @param {string} text - The text to be displayed in the toast message box.
 * @returns {string} An HTML string representing the toast message box.
 */
function getToastMessage(text) {
  return /*html*/ `
    <div id="toast-message" class="toast-message-box">
      <p class="toast-message-text inter-extralight">${text}</p>
    </div>
    `;
}

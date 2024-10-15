/**
 * Returns an HTML template for the header component.
 *
 * @returns {string} The HTML template.
 */
function getHeaderTemplate() {
  return /*html*/ `
        <h2 class="inter-extralight heading-text">Kanban Project Management Tool</h2>
        <img class="header-respo-logo" src="./assets/img/logo.png" alt="Join Logo">
        <div class="header-right">
            <a href="help.html"><img class="qeustion-mark" src="./assets/img/icons/qeustion-mark.png" /></a>
            <div class="profile-icon">
                <span class="inter-medium">G</span>
            </div>
        </div>
    `;
}

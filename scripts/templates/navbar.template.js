/**
 * Returns an HTML template for the navbar.
 *
 * @param {string} currentPage - The currently active page.
 * @returns {string} The HTML template.
 */
function getNavbarTemplate(currentPage) {
  return /*html*/ ` 
    <div class="navbar-logo-container">
      <img class="navbar-logo" src="assets/img/join-logo.png" alt="Join Logo"/> 
    </div>
    <div class="navbar-link-container">
      <ul>
        <li><a class="navigation navbar-link ${
          currentPage == "summary" ? "active" : ""
        }" href="#"><img src="./assets/img/icons/summary.png" alt="Summary Icon">Summary</a></li>
        <li><a class="navigation navbar-link ${
          currentPage == "add-task" ? "active" : ""
        }" href="#"><img src="./assets/img/icons/add-task.png" alt="Add Task Icon">Add Task</a></li>
        <li><a class="navigation navbar-link ${
          currentPage == "board" ? "active" : ""
        }" href="#"><img src="./assets/img/icons/board.png" alt="Board Icon">Board</a></li>
        <li><a class="navigation navbar-link ${
          currentPage == "contacts" ? "active" : ""
        }" href="./contacts.html"><img src="./assets/img/icons/contacts.png" alt="Contacts Icon">Contacts</a></li>
      </ul>
      <ul>
        <li><a class="navigation gdpr" href="privacyPolicy.html">Privacy Policy</a></li>
        <li><a class="navigation gdpr" href="legalNotice.html">Legal notice</a></li>
      </ul>
    </div>
    `;
}

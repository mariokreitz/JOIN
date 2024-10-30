/**
 * Returns an HTML template for the navbar.
 *
 * @param {string} currentPage - The currently active page.
 * @returns {string} The HTML template.
 */
function getNavbarTemplate(currentPage) {
  return /*html*/ ` 
    <div class="navbar-logo-container">
      <img class="navbar-logo" src="./assets/svg/logo-white.svg" alt="Join Logo"/> 
    </div>
    <div class="navbar-link-container" ${currentUser.isLoggedIn ? "" : 'style="justify-content: flex-end;"'}>
      ${
        currentUser.isLoggedIn
          ? `      <ul>
        <li><a class="navigation navbar-link ${
          currentPage == "summary" ? "active" : ""
        }" href="./summary.html"><img src="./assets/svg/summary.svg" alt="Summary Icon">Summary</a></li>
        <li><a class="navigation navbar-link ${
          currentPage == "add-task" ? "active" : ""
        }" href="./add-task.html"><img src="../assets/svg/add-task.svg" alt="Add Task Icon">Add Task</a></li>
        <li><a class="navigation navbar-link ${
          currentPage == "board" ? "active" : ""
        }" href="./board.html"><img src="./assets/svg/board.svg" alt="Board Icon">Board</a></li>
        <li><a class="navigation navbar-link ${
          currentPage == "contacts" ? "active" : ""
        }" href="./contacts.html"><img src="./assets/svg/contact.svg" alt="Contacts Icon">Contacts</a></li>
      </ul>`
          : ""
      }
      <ul>
        <li><a class="navigation gdpr ${
          currentPage == "privacy" ? "active" : ""
        }" href="./policy.html">Privacy Policy</a></li>
        <li><a class="navigation gdpr ${
          currentPage == "legal" ? "active" : ""
        }" href="./legal-notice.html">Legal notice</a></li>
      </ul>
    </div>
    `;
}

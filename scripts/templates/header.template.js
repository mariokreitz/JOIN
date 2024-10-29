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
            ${
              currentUser.isLoggedIn
                ? /*html*/ `
                <a href="./help.html"><img class="qeustion-mark" src="./assets/img/icons/qeustion-mark.png" /></a>
                <button onclick="openProfileMenu()" type="button" class="btn btn-profile">
                  <span class="inter-medium">${getInitialsFromContact(currentUser).toUpperCase()}</span>
                </button>
                `
                : ""
            }
          <div id="profile-menu" class="profile-menu d_none">
            <button onclick="" class="inter-extralight">Help</button>
            <button onclick="" class="inter-extralight">Legal Notice</button>
            <button onclick="" class="inter-extralight">Privacy Policy</button>
            <button onclick="logout()" class="inter-extralight">Log Out</button>
          </div>
        </div>
    `;
}

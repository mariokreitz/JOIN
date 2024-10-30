/**
 * Returns an HTML template for the header component.
 *
 * @returns {string} The HTML template.
 */
function getHeaderTemplate() {
  return /*html*/ `
        <h2 class="inter-extralight heading-text">Kanban Project Management Tool</h2>
        <img class="header-respo-logo" src="./assets/svg/logo.svg" alt="Join Logo">
        <div class="header-right">
            ${
              currentUser.isLoggedIn
                ? /*html*/ `
                <a href="./help.html"><img class="qeustion-mark" src="./assets/svg/help.svg" /></a>
                <button id="profile-menu-toggler" onclick="openProfileMenu()" type="button" class="btn btn-profile">
                  <span class="inter-medium">${getInitialsFromContact(currentUser).toUpperCase()}</span>
                </button>
                `
                : ""
            }
          <div id="profile-menu" class="profile-menu d_none">
            <button onclick="window.location.href='./help.html'" class="inter-extralight">Help</button>
            <button onclick="window.location.href='./legal-notice.html'" class="inter-extralight">Legal Notice</button>
            <button onclick="window.location.href='./policy.html'" class="inter-extralight">Privacy Policy</button>
            <button onclick="logout()" class="inter-extralight">Log Out</button>
          </div>
        </div>
    `;
}

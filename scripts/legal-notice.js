/**
 * Initializes the page by loading the necessary components.
 *
 * @returns {void}
 */
function init() {
  loadComponents();
}

/**
 * Loads all necessary components into the page.
 *
 * Currently, this function only loads the header and navbar components.
 * @returns {void}
 */
function loadComponents() {
  loadHeader();
  adjustNavbarForMobile();
}

/**
 * Loads the header component into the element with the id "header".
 * If no element with that id exists, this function does nothing.
 * @returns {void}
 */
function loadHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  header.innerHTML = getHeaderTemplate();
}

/**
 * Loads the navbar component into the element with the id "navbar".
 * If no element with that id exists, this function does nothing.
 *
 * @returns {void}
 */
function loadNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  navbar.innerHTML = getNavbarTemplate("legal");
}

/**
 * Adjusts the navbar based on the window width.
 *
 * @returns {void}
 */
function adjustNavbarForMobile() {
  const navbar = document.getElementById("navbar");

  if (window.innerWidth >= 768) {
    if (!navbar) {
      const nav = document.createElement("nav");
      nav.id = "navbar";
      nav.classList.add("navbar");
      document.body.appendChild(nav);
    }
    navbar.innerHTML = getNavbarTemplate("legal");
  } else if (navbar && !currentUser.isLoggedIn) navbar.remove();
  loadNavbar();
}

window.addEventListener("resize", adjustNavbarForMobile);

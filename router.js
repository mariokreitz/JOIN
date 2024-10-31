/**
 * A reference to the currently open menu, if any.
 *
 * @type {HTMLDivElement|null}
 */
let currentlyOpenMenu = null;

/**
 * The current user object, used to store the user's
 * information and keep track of their login status.
 * @type {Object}
 */
const currentUser = {
  isLoggedIn: false,
};

/**
 * Initializes the current user object by loading it from
 * local storage and saving it back to local storage if it
 * does not exist.
 */
function initializeCurrentUser() {
  loadCurrentUserFromLocalStorage();
  if (!currentUser.isLoggedIn) {
    saveCurrentUserToLocalStorage();
  }
}

initializeCurrentUser();

/**
 * Saves the current user object to local storage.
 * The user object is stringified before being stored.
 * This allows the user information to persist across
 * browser sessions.
 */
function saveCurrentUserToLocalStorage() {
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

/**
 * Loads the current user from local storage and updates the global user object.
 * If no user is found, the global user object remains unchanged.
 */
function loadCurrentUserFromLocalStorage() {
  const storedUserData = localStorage.getItem("currentUser");
  if (storedUserData) {
    Object.assign(currentUser, JSON.parse(storedUserData));
  }
}

/**
 * Saves user credentials to local storage, stringifying them first.
 * This allows the user credentials to persist across browser sessions.
 * The key used is "userCredentials".
 * @param {Object} credentials - The user credentials to be saved.
 */
function saveUserCredentialsToLocalStorage(credentials) {
  localStorage.setItem("userCredentials", JSON.stringify(credentials));
}

/**
 * Loads user credentials from local storage.
 * If credentials are found, they are parsed from JSON
 * and returned as an object.
 *
 * @returns {Object|undefined} The parsed user credentials object,
 * or undefined if no credentials are stored.
 */
function loadUserCredentialsFromLocalStorage() {
  const storedCredentials = localStorage.getItem("userCredentials");
  return storedCredentials ? JSON.parse(storedCredentials) : undefined;
}

/**
 * Object containing all routes of the application.
 * The keys are the paths of the routes and the values
 * are the functions that should be executed when the route
 * is accessed.
 *
 * @typedef {Object} Routes
 * @property {Function} '/' - Function to check authorization for the homepage.
 * @property {Function} '/index.html' - Function to check authorization for the homepage.
 * @property {Function} '/summary.html' - Function to check authorization for the summary page.
 * @property {Function} '/board.html' - Function to check authorization for the board page.
 * @property {Function} '/contacts.html' - Function to check authorization for the contacts page.
 * @property {Function} '/add-task.html' - Function to check authorization for the add task page.
 * @property {Function} '/legal-notice.html' - Function to check authorization for the legal notice page.
 * @property {Function} '/policy.html' - Function to check authorization for the policy page.
 * @property {Function} '/help.html' - Function to check authorization for the help page.
 */
const routes = {
  "/": checkAuthorization,
  "/index.html": checkAuthorization,
  "/summary.html": checkAuthorization,
  "/board.html": checkAuthorization,
  "/contacts.html": checkAuthorization,
  "/add-task.html": checkAuthorization,
  "/legal-notice.html": checkAuthorization,
  "/policy.html": checkAuthorization,
  "/help.html": checkAuthorization,
};

/**
 * Checks if the user is logged in and authorized to access the current route.
 * If the user is logged in, it redirects to the summary page if the current route is the homepage.
 * If the user is not logged in and the current route is protected, it redirects to the login page.
 */
function checkAuthorization() {
  const { isLoggedIn } = currentUser;
  const path = window.location.pathname;

  if (isLoggedIn) {
    if (path === "/" || path === "/index.html") window.location.href = "/summary.html";
    return;
  }

  const isProtectedRoute = routes[path] && path !== "/policy.html" && path !== "/legal-notice.html";
  if (isProtectedRoute) window.location.href = "/login.html";
}

/**
 * If the user is logged in, redirects the user to the homepage.
 * Otherwise, does nothing.
 */
function redirectToHomeIfAuthorized() {
  if (currentUser.isLoggedIn) window.location.href = "/";
}

/**
 * Handles changes in the route by executing the appropriate function
 * for the current path. If no matching route is found, it redirects
 * the user to the homepage if authorized.
 */
function handleRouteChange() {
  const currentPathname = window.location.pathname;
  const route = routes[currentPathname];

  if (route) route();
  else redirectToHomeIfAuthorized();
}

/**
 * Listens for popstate events and handles route changes.
 */
window.addEventListener("popstate", handleRouteChange);
/**
 * Listens for page load events and handles route changes.
 */
window.addEventListener("load", handleRouteChange);

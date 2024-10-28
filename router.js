const currentUser = {
  isLoggedIn: false,
};

if (!localStorage.getItem("currentUser")) {
  saveUserToLocalStorage();
}
loadUserFromLocalStorage();

/**
 * Saves the current user object to local storage.
 * The user object is stringified before being stored.
 * This allows the user information to persist across
 * browser sessions.
 */
function saveUserToLocalStorage() {
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

/**
 * Loads the user object from local storage and updates the global user object.
 * If no user is found in local storage, the user object remains unchanged.
 */
function loadUserFromLocalStorage() {
  const storedUser = localStorage.getItem("currentUser");
  if (storedUser) {
    Object.assign(currentUser, JSON.parse(storedUser));
  }
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
 * Checks if a user is authorized to access the current route.
 * If the user is authorized but on the homepage, redirects to the summary page.
 * If the user is not authorized but on a protected route, redirects to the login page.
 * Otherwise, does nothing.
 */
function checkAuthorization() {
  const isLoggedIn = currentUser.isLoggedIn;
  const currentPath = window.location.pathname;

  if (isLoggedIn) {
    if (currentPath === "/" || currentPath === "/index.html") window.location.href = "/summary.html";
    return;
  }

  if (routes[currentPath]) window.location.href = "/login.html";
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

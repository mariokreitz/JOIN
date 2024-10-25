user = {
  name: "guest",
  isLoggedIn: true,
};

/**
 * A dictionary of routes and their associated authorization functions.
 * @type {Object<string, function>}
 */
const routes = {
  "/": checkAuthorization,
  "/index.html": checkAuthorization,
  "/summary.html": checkAuthorization,
  "/board.html": checkAuthorization,
  "/contacts.html": checkAuthorization,
  "/add-task.html": checkAuthorization,
};

/**
 * Checks if the user is authorized to access the current page.
 * If not, redirects them to the 401 page.
 */
function checkAuthorization() {
  if (user.isLoggedIn) return;

  const currentPath = window.location.pathname;

  if (routes[currentPath]) window.location.href = "/401.html";
}

function redirectToHomeIfAuthorized() {
  if (user.isLoggedIn) window.location.href = "/";
}

/**
 * Handles route changes by checking authorization and redirecting if necessary.
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

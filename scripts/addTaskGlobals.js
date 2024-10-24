/**
 * Array of selected options in the contact dropdown.
 * @type {Array<string>}
 */
let selectedOptions = [];

/**
 * Object containing subtasks. Each key is a subtask id and each value
 * is an object containing the subtask title and completed status.
 * @type {Object<string, {title: string, completed: boolean}>}
 */
let subTasks = {};

/**
 * The current priority of the task being added.
 * @type {string}
 */
let priority = "medium";

/**
 * Whether the category dropdown is currently open.
 * @type {boolean}
 */
let isCategoryDropdownOpen = false;

/**
 * Whether the contact dropdown is currently open.
 * @type {boolean}
 */
let isContactDropdownOpen = false;

/**
 * The global state of the app.
 * @type {string}
 */
let globalState = "todo";

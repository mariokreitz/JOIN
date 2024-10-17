/**
 * Converts an object to an array of its values.
 *
 * @param {Object} obj - The input object to convert to an array.
 * @returns {Array} An array containing the values of the input object.
 */
function objectToArray(obj) {
  if (!obj) {
    return [];
  }

  return Object.keys(obj).map((key) => obj[key]);
}

/**
 * Returns the number of key-value pairs in the given object.
 *
 * @param {Object} obj - The input object to get the length from.
 * @returns {number} The number of key-value pairs in the object.
 */
function getObjectLength(obj) {
  return Object.keys(obj).length;
}

/**
 * Finds the key of the object that contains the given name from the param.
 *
 * @param {Object} obj - The input object to search in.
 * @param {string} name - The name to search for.
 * @returns {string} The key of the object that contains the given name.
 */
function findKeyByName(obj, name) {
  return Object.keys(obj).find((key) => obj[key].name === name);
}

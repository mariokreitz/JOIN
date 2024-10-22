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
  if (!obj) {
    return 0;
  }
  return Object.keys(obj).length;
}

/**
 * Finds the key in an object whose associated value has a specific 'createdAt' property value.
 *
 * @param {Object} obj - The input object to search through.
 * @param {string|number} createdAt - The 'createdAt' value to match against the object's values.
 * @returns {string|undefined} The key in the object whose value has the matching 'createdAt' value, or undefined if not found.
 */
function findKeyByCreatedAt(obj, createdAt) {
  return Object.keys(obj).find((key) => obj[key].createdAt == createdAt);
}

/**
 * Converts an array of objects back to an object, using the 'createdAt' property as the key.
 *
 * @param {Array<Object>} arr - The input array to convert to an object.
 * @returns {Object} An object where each key is the 'createdAt' value of the corresponding item in the array.
 */
function arrayToObject(arr) {
  return arr.reduce((acc, item) => {
    if (item.createdAt) {
      acc[`TODO${item.createdAt}`] = item;
    }
    return acc;
  }, {});
}

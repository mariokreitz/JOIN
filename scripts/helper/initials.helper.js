/**
 * Given a contact object, returns the contact's initials as a string. The
 * initials are determined by taking the first character of the first name and
 * the first character of the last name. If either the first or last name is not
 * present, the corresponding initial is an empty string.
 *
 * @param {object} contact - Contact object with a `name` property.
 * @returns {string} The contact's initials as a string.
 */
function getInitialsFromContact({ name: fullName }) {
  const [firstName, lastName] = fullName.split(" ");
  const firstInitial = firstName ? firstName.charAt(0) : "";
  const lastInitial = lastName ? lastName.charAt(0) : "";
  return `${firstInitial}${lastInitial}`;
}

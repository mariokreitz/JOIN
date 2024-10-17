/**
 * Toggles the contact view based on the id of the contact item. If the contact
 * item is selected, the contact view is rendered with the contact's initials and
 * contact information. If the contact item is deselected, the contact view is
 * cleared.
 *
 * @param {number} contactId - The id of the contact item.
 * @returns {void}
 */
function toggleContactView(contactId) {
  const { deviceType, browserType } = getBrowserInformation();
  const contactItemElement = document.getElementById(`contact-item-${contactId}`);
  const contactViewElement = document.getElementById("contact-view");
  if (contactId === -1) {
    deselectContact(contactViewElement);
    return;
  }
  if (!contactItemElement || !contactViewElement) return;
  const contactName = contactItemElement.querySelector(".contact-name").textContent;
  const contact = contacts.find((c) => c.name === contactName);
  const initials = getInitialsFromContact(contact);
  const isAlreadySelected = contact.contactSelect;
  toggleSelectedContactInList(contact, contactItemElement);
  if (isAlreadySelected) {
    applyAnimationToContactView("slide-out", contactViewElement, () => {
      contactViewElement.innerHTML = "";
    });
  } else {
    displayContactView(contactViewElement, initials, contact);
  }
  adjustDisplayForScreenSize(contact);
  setButtonPositionForMobileDevices(deviceType, browserType);
}

/**
 * Returns an object containing the type of device and browser. The device type
 * can be "ios", "android", "windows", or "other". The browser type can be
 * "chrome", "firefox", "edge", "ie", "safari", or "other".
 *
 * @returns {{ deviceType: string, browserType: string }}
 */
function getBrowserInformation() {
  const deviceType = determineDeviceType();
  const browserType = getBrowserType(deviceType);
  return { deviceType, browserType };
}

/**
 * Sets the position of the menu button on mobile devices based on the type of
 * device and browser. This is a workaround for the position: fixed bug in
 * mobile devices, where the position: fixed element is not placed correctly on
 * the screen.
 *
 * @param {string} deviceType - The type of the device. Should be "ios", "android", "windows", or "other".
 * @param {string} browserType - The type of the browser. Should be "safari", "chrome", or "other".
 * @returns {void}
 */
function setButtonPositionForMobileDevices(deviceType, browserType) {
  switch (deviceType) {
    case "ios":
      setButtonPositionForIOS(deviceType, browserType);
      break;
    case "android":
      setButtonPositionForAndroid(deviceType, browserType);
      break;
  }
}

/**
 * Adjusts the position of the menu button on iOS devices based on the type of browser.
 * This is a workaround for the position: fixed bug in iOS devices, where the
 * position: fixed element is not placed correctly on the screen.
 *
 * @param {string} deviceType - The type of the device. Should be "ios", "android", "windows", or "other".
 * @param {string} browserType - The type of the browser. Should be "safari", "chrome", or "other".
 * @returns {void}
 */
function setButtonPositionForIOS(deviceType, browserType) {
  const menuButton = document.getElementById("menuButton");

  if (deviceType === "ios" && browserType === "safari") {
    menuButton.style.bottom = "100px";
  }

  if (deviceType === "ios" && browserType === "chrome") {
    menuButton.style.bottom = "120px";
  }
}

/**
 * Adjusts the position of the menu button on Android devices based on the type of
 * browser. This is a workaround for the position: fixed bug in Android devices,
 * where the position: fixed element is not placed correctly on the screen.
 *
 * @param {string} deviceType - The type of the device. Should be "ios",
 *   "android", "windows", or "other".
 * @param {string} browserType - The type of the browser. Should be "chrome" or
 *   "other".
 * @returns {void}
 */
function setButtonPositionForAndroid(deviceType, browser) {
  const menuButton = document.getElementById("menuButton");

  if (deviceType === "android") {
    menuButton.style.bottom = "80px";
  }
}

/**
 * Determines the device type by checking the user agent string.
 *
 * @returns {string} The type of the device. Can be "ios", "android", "windows", or "other".
 */
function determineDeviceType() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  let deviceType;

  if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
    deviceType = "ios";
  } else if (userAgent.match(/Android/i)) {
    deviceType = "android";
  } else if (userAgent.match(/Windows Phone/i) || userAgent.match(/Windows/i) || userAgent.match(/Win/i)) {
    deviceType = "windows";
  } else {
    deviceType = "other";
  }

  return deviceType;
}

function getBrowserType(deviceType) {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  let browserType;

  if (deviceType === "ios") {
    if (userAgent.match(/CriOS/i)) {
      browserType = "chrome";
    } else if (userAgent.match(/FxiOS/i)) {
      browserType = "firefox";
    } else {
      browserType = "safari";
    }
  } else if (deviceType === "android") {
    if (userAgent.match(/Chrome/i)) {
      browserType = "chrome";
    } else if (userAgent.match(/Firefox/i)) {
      browserType = "firefox";
    } else {
      browserType = "android";
    }
  } else if (deviceType === "windows") {
    if (userAgent.match(/Edge/i)) {
      browserType = "edge";
    } else if (userAgent.match(/Trident/i)) {
      browserType = "ie";
    } else if (userAgent.match(/MSIE/i)) {
      browserType = "ie";
    } else {
      browserType = "windows";
    }
  } else {
    browserType = "other";
  }

  return browserType;
}

/**
 * Deselects the currently selected contact and clears the contact view.
 *
 * @param {HTMLElement} contactViewElement - The element displaying the contact view.
 */
function deselectContact(contactViewElement) {
  const previouslySelectedElement = document.querySelector(".selected");
  if (previouslySelectedElement) {
    previouslySelectedElement.classList.remove("selected");
    const previouslySelectedContact = contacts.find(
      (c) => c.name === previouslySelectedElement.querySelector(".contact-name").textContent
    );
    if (previouslySelectedContact) {
      previouslySelectedContact.contactSelect = false;
    }
  }

  contactViewElement.innerHTML = "";
  const contactListWrapper = document.querySelector(".contact-list-wrapper");
  const contactMainContainer = document.querySelector(".contact-main-container");
  contactListWrapper.style.display = "block";
  contactMainContainer.style.display = "none";
}

/**
 * Displays the contact view with the selected contact's information.
 *
 * @param {HTMLElement} contactViewElement - The element displaying the contact view.
 * @param {string} initials - The initials of the contact.
 * @param {Object} contact - The contact object containing contact information.
 */
function displayContactView(contactViewElement, initials, contact) {
  if (contactViewElement.innerHTML) {
    applyAnimationToContactView("slide-out", contactViewElement, () => {
      contactViewElement.innerHTML = getContactViewTemplate(initials, contact);
      applyAnimationToContactView("slide-in", contactViewElement);
    });
  } else {
    contactViewElement.innerHTML = getContactViewTemplate(initials, contact);
    applyAnimationToContactView("slide-in", contactViewElement);
  }
}

/**
 * Adjusts the display of the contact list and main container based on the selected contact
 * and screen size.
 *
 * @param {Object} contact - The currently selected contact.
 */
function adjustDisplayForScreenSize(contact) {
  if (window.innerWidth <= 1320) {
    const contactListWrapper = document.querySelector(".contact-list-wrapper");
    const contactMainContainer = document.querySelector(".contact-main-container");
    contactListWrapper.style.display = contact.contactSelect ? "none" : "block";
    contactMainContainer.style.display = contact.contactSelect ? "block" : "none";
  }
}

/**
 * Toggles the selected class on the contact item element and updates the
 * contactSelect property of the selected contact.
 *
 * @param {Object} selectedContact - The contact object of the selected contact.
 * @param {HTMLElement} contactItemElement - The <li> element representing the contact item.
 */
function toggleSelectedContactInList(selectedContact, contactItemElement) {
  const previouslySelectedElement = document.querySelector(".selected");
  if (contactItemElement.classList.contains("selected")) {
    contactItemElement.classList.remove("selected");
    selectedContact.contactSelect = false;
  } else {
    contactItemElement.classList.add("selected");
    selectedContact.contactSelect = true;
  }
  if (previouslySelectedElement && previouslySelectedElement !== contactItemElement) {
    previouslySelectedElement.classList.remove("selected");
    const previouslySelectedContact = contacts.find(
      (c) => c.name === previouslySelectedElement.querySelector(".contact-name").textContent
    );
    if (previouslySelectedContact) {
      previouslySelectedContact.contactSelect = false;
    }
  }
}

/**
 * Applies an animation to the contact view element.
 *
 * @param {string} animationType - The type of animation to apply.
 * @param {HTMLElement} element - The element to which the animation will be applied.
 * @param {Function} callback - A callback function to execute after the animation ends.
 */
function applyAnimationToContactView(animationType, element, callback) {
  const body = document.body;
  body.style.overflow = "hidden";
  element.style.animation = `${animationType} 0.3s ease-out forwards`;
  if (callback) {
    element.addEventListener(
      "animationend",
      () => {
        body.style.overflow = "";
        callback();
      },
      { once: true }
    );
  }
}

function toggleEditMenu() {
  const menu = document.getElementById("contact-edit-menu");
  if (menu.classList.contains("show")) {
    menu.classList.remove("show");
    document.removeEventListener("click", closeEditMenu);
  } else {
    menu.classList.add("show");
    document.addEventListener("click", closeEditMenu);
  }
}

function closeEditMenu(event) {
  const menu = document.getElementById("contact-edit-menu");
  const button = document.getElementById("menuButton");
  if (menu && button) {
    if (!menu.contains(event.target) && !button.contains(event.target)) {
      menu.classList.remove("show", "d_none");
      document.removeEventListener("click", closeEditMenu);
    }
  }
}

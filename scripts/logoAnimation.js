/**
 * Sets the initial position and size of the logo based on the window width.
 * For mobile devices (width < 768px), the logo is larger and centered.
 * For larger screens, the logo is smaller and positioned differently.
 */
function setLogoStartPosition() {
  const logo = document.getElementById("login-logo");
  if (window.innerWidth <= 768) {
    logo.style.width = "150px";
    logo.style.height = "150px";
    logo.style.left = "calc(50% - 75px)";
    logo.style.top = "calc(50vh - 75px)";
  } else {
    logo.style.width = "300px";
    logo.style.height = "300px";
    logo.style.left = "calc(50% - 150px)";
    logo.style.top = "calc(50vh - 150px)";
  }
}

/**
 * Sets the final position and size of the logo based on the window width.
 * For mobile devices (width <= 768px), the logo is smaller and positioned
 * at specific coordinates. For larger screens, it has a different size
 * and position. Additionally, it restores the body's overflow to auto.
 */
function setLogoFinalPosition() {
  const logo = document.getElementById("login-logo");
  if (window.innerWidth <= 768) {
    logo.style.width = "60px";
    logo.style.height = "78px";
    logo.style.left = "40px";
    logo.style.top = "25px";
  } else {
    logo.style.width = "90px";
    logo.style.height = "110px";
    logo.style.left = "60px";
    logo.style.top = "37px";
  }
  document.body.style.overflow = "auto";
}

/**
 * Triggers the logo animation sequence. Sets the initial logo position,
 * applies a white fill to the logo paths if on mobile, and triggers
 * the animation sequence. Handles the case where the referrer is the
 * signup page by skipping the animation.
 */
function triggerLogoAnimation() {
  const overlay = document.getElementById("overlay");
  const logo = document.getElementById("login-logo");
  const paths = document.querySelectorAll(".fade-path");
  if (isSignupReferrer()) {
    handleSignupReferrer();
    return;
  }
  document.body.style.overflow = "hidden";
  setLogoStartPosition();
  if (window.innerWidth <= 768) {
    setWhiteFill(paths);
    triggerFadeIn(paths);
  }
  triggerLogoAnimationSequence(overlay, logo);
}

/**
 * Checks if the document referrer is the signup page.
 * @returns {boolean} True if the referrer includes "signup.html", false otherwise.
 */
function isSignupReferrer() {
  return document.referrer.includes("signup.html");
}

/**
 * Handles the situation when the referrer is the signup page.
 * Sets the final position of the logo and hides the overlay.
 */
function handleSignupReferrer() {
  const overlay = document.getElementById("overlay");
  setLogoFinalPosition();
  overlay.style.display = "none";
}

/**
 * Sets the fill color of all provided paths to white.
 * @param {NodeList} paths - The list of SVG path elements to modify.
 */
function setWhiteFill(paths) {
  paths.forEach((path) => {
    path.setAttribute("fill", "#ffffff");
  });
}

/**
 * Triggers the fade-in animation for the logo paths after a delay.
 * @param {NodeList} paths - The list of SVG path elements to animate.
 */
function triggerFadeIn(paths) {
  setTimeout(() => {
    paths.forEach((path) => {
      path.classList.add("fade-in");
    });
  }, 2000);
}

/**
 * Manages the logo animation sequence, triggering the overlay fade-out
 * and logo animation, followed by hiding the overlay and setting the final
 * position of the logo.
 * @param {HTMLElement} overlay - The overlay element to animate.
 * @param {HTMLElement} logo - The logo element to animate.
 */
function triggerLogoAnimationSequence(overlay, logo) {
  setTimeout(() => {
    overlay.classList.add("fade-out");
    logo.classList.add("logo-animate");

    setTimeout(() => {
      overlay.style.display = "none";
      setLogoFinalPosition();
    }, 1000);
  }, 2000);
}

// Event listener to adjust the logo position on window resize.
window.addEventListener("resize", () => {
  setLogoFinalPosition();
});

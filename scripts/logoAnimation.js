function setLogoFinalPosition() {
  const logo = document.getElementById("login-logo");
  logo.style.width = "90px";
  logo.style.height = "110px";
  logo.style.left = "60px";
  logo.style.top = "55px";
  document.getElementById("overlay").style.display = "none";
  document.body.style.overflow = "auto";
}

function triggerLogoAnimation() {
  const overlay = document.getElementById("overlay");
  if (document.referrer.includes("signup.html")) {
    setLogoFinalPosition();
    return;
  }
  document.body.style.overflow = "hidden";
  setTimeout(() => {
    overlay.classList.add("fade-out");
    const logo = document.getElementById("login-logo");
    logo.classList.add("logo-animate");

    setTimeout(() => {
      overlay.style.display = "none";
      document.body.style.overflow = "auto";
    }, 1000);
  }, 2000);
}

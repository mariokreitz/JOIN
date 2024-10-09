function init() {
  render();
}

function render() {
  let renderContainer = document.getElementById("main-container");
  renderContainer.innerHTML += getTemplate();
}

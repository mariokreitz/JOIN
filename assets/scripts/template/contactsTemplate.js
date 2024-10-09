function getTemplate() {
  return `    <header>

      <h1 class="heading-text">Kanban Projekt Management Tool</h1>
      <div class="header-right">
        <img class="qeustion-mark" src="./assets/img/icons/qeustion-mark.png">
        <img class="eclipse" src="./assets/img/icons/eclipse.png">
      </div>

    </header>

    <nav class="navbar"> 
      <div class="navbar-logo-container">
        <img class="join-navbar-logo" src="assets/img/join-logo.png" alt="Join Logo"/> 
      </div>


      <div class="navigations-tasks">
        <div class="navigation"><img class="navigations-icons" src="./assets/img/icons/summary.png"><a class="nav-link" href="#">Summary</a></div>
        <div class="navigation"><img class="navigations-icons" src="./assets/img/icons/add-task.png"><a class="nav-link" href="#">Add Task</a></div>
        <div class="navigation"><img class="navigations-icons" src="./assets/img/icons/board.png"><a class="nav-link" href="#">Board</a></div>
        <div class="navigation"><img class="navigations-icons" src="./assets/img/icons/contacts.png"><a class="nav-link" href="#">Contacts</a></div>
      </div>

      <div class="policy-and-notice">
        <a href="#">Privacy Policy</a>
        <a href="#">Legal notice</a>
      </div> `;
}

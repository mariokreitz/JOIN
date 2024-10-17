function getTaskCardSmallTemplate(title = "N/A", subheadline = "N/A", description = "N/A") {
  return /*html*/ `
    <div class="task-card-small">
        <div class="card-small-header">
            <p class="inter-extralight">${title}</p>
        </div>
        <div class="card-small-body">
            <div class="card-small-info">
            <p class="card-small-subheadline inter-medium">${subheadline}</p>
            <p class="card-small-description inter-extralight">${description}</p>
            </div>
            <div class="card-small-progress-bar">
            <div class="card-small-progress-bar-background">
                <div class="card-small-progress-bar-foreground" style="width: 50%"></div>
            </div>
            <span class="card-small-progress-bar-text inter-extralight">1/2 Subtasks</span>
            </div>
        </div>
        <div class="card-small-card-footer">
            <div class="card-small-assigned-members">
            <div class="card-mall-assigend-member-badge">MK</div>
            <div class="card-mall-assigend-member-badge">FW</div>
            <div class="card-mall-assigend-member-badge">KT</div>
            </div>
            <div class="card-small-urgency-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_75609_16182)">
                <path
                    d="M23.5685 19.1666L8.43151 19.1666C8.18446 19.1666 7.94752 19.0677 7.77283 18.8918C7.59814 18.7158 7.5 18.4772 7.5 18.2283C7.5 17.9795 7.59814 17.7408 7.77283 17.5649C7.94752 17.3889 8.18446 17.29 8.43151 17.29L23.5685 17.29C23.8155 17.29 24.0525 17.3889 24.2272 17.5649C24.4019 17.7408 24.5 17.9795 24.5 18.2283C24.5 18.4772 24.4019 18.7158 24.2272 18.8918C24.0525 19.0677 23.8155 19.1666 23.5685 19.1666Z"
                    fill="#FFA800" />
                <path
                    d="M23.5685 14.7098L8.43151 14.7098C8.18446 14.7098 7.94752 14.6109 7.77283 14.435C7.59814 14.259 7.5 14.0204 7.5 13.7715C7.5 13.5227 7.59814 13.284 7.77283 13.1081C7.94752 12.9321 8.18446 12.8333 8.43151 12.8333L23.5685 12.8333C23.8155 12.8333 24.0525 12.9321 24.2272 13.1081C24.4019 13.284 24.5 13.5227 24.5 13.7715C24.5 14.0204 24.4019 14.259 24.2272 14.435C24.0525 14.6109 23.8155 14.7098 23.5685 14.7098Z"
                    fill="#FFA800" />
                </g>
                <defs>
                <clipPath id="clip0_75609_16182">
                    <rect width="17" height="6.33333" fill="white" transform="translate(7.5 12.8333)" />
                </clipPath>
                </defs>
            </svg>
            </div>
        </div>
    </div>
  `;
}

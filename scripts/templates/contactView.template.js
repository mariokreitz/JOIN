/**
 * Given the initials, color, name, email, and phone of a contact, returns an
 * HTML string representing a single contact card in the contact view.
 *
 * @param {string} initials - The initials of the contact.
 * @param {{ color: string, name: string, email: string, phone: string }} contactInfo
 *   - An object containing the color, name, email, and phone of the contact.
 * @returns {string} An HTML string representing the contact card.
 */
function getContactViewTemplate(initials, { color, name, email, phone }) {
  return /*html*/ `
        <div class="contact-main-card">
            <div class="contact-main-header">
                <span class="inter-light contact-main-initials" style="background-color: ${color}">${initials}</span>
                <div class="contact-main-info">
                    <p id="contact-main-name" class="inter-light">${name}</p>
                    <div class="contact-main-controls">
                        <button
                        class="inter-extralight contact-main-control-btn"
                        onclick="openContactModal('edit','${name}','${email}','${phone}','${color}')" 
                        type="button">
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 17H3.9L12.525 8.375L11.125 6.975L2.5 15.6V17ZM16.8 6.925L12.55 2.725L13.95 1.325C14.3333 0.941667 14.8042 0.75 15.3625 0.75C15.9208 0.75 16.3917 0.941667 16.775 1.325L18.175 2.725C18.5583 3.10833 18.7583 3.57083 18.775 4.1125C18.7917 4.65417 18.6083 5.11667 18.225 5.5L16.8 6.925ZM15.35 8.4L4.75 19H0.5V14.75L11.1 4.15L15.35 8.4Z" fill="#29ABE2"/>
                            </svg>Edit</button>
                        <button onclick="deleteContact('${name}')"
                        class="inter-extralight contact-main-control-btn"
                        type="button">
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="mask0_71348_10272" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
                            <rect x="0.5" width="24" height="24" fill="#D9D9D9"/>
                            </mask>
                            <g mask="url(#mask0_71348_10272)">
                            <path d="M7.5 21C6.95 21 6.47917 20.8042 6.0875 20.4125C5.69583 20.0208 5.5 19.55 5.5 19V6C5.21667 6 4.97917 5.90417 4.7875 5.7125C4.59583 5.52083 4.5 5.28333 4.5 5C4.5 4.71667 4.59583 4.47917 4.7875 4.2875C4.97917 4.09583 5.21667 4 5.5 4H9.5C9.5 3.71667 9.59583 3.47917 9.7875 3.2875C9.97917 3.09583 10.2167 3 10.5 3H14.5C14.7833 3 15.0208 3.09583 15.2125 3.2875C15.4042 3.47917 15.5 3.71667 15.5 4H19.5C19.7833 4 20.0208 4.09583 20.2125 4.2875C20.4042 4.47917 20.5 4.71667 20.5 5C20.5 5.28333 20.4042 5.52083 20.2125 5.7125C20.0208 5.90417 19.7833 6 19.5 6V19C19.5 19.55 19.3042 20.0208 18.9125 20.4125C18.5208 20.8042 18.05 21 17.5 21H7.5ZM7.5 6V19H17.5V6H7.5ZM9.5 16C9.5 16.2833 9.59583 16.5208 9.7875 16.7125C9.97917 16.9042 10.2167 17 10.5 17C10.7833 17 11.0208 16.9042 11.2125 16.7125C11.4042 16.5208 11.5 16.2833 11.5 16V9C11.5 8.71667 11.4042 8.47917 11.2125 8.2875C11.0208 8.09583 10.7833 8 10.5 8C10.2167 8 9.97917 8.09583 9.7875 8.2875C9.59583 8.47917 9.5 8.71667 9.5 9V16ZM13.5 16C13.5 16.2833 13.5958 16.5208 13.7875 16.7125C13.9792 16.9042 14.2167 17 14.5 17C14.7833 17 15.0208 16.9042 15.2125 16.7125C15.4042 16.5208 15.5 16.2833 15.5 16V9C15.5 8.71667 15.4042 8.47917 15.2125 8.2875C15.0208 8.09583 14.7833 8 14.5 8C14.2167 8 13.9792 8.09583 13.7875 8.2875C13.5958 8.47917 13.5 8.71667 13.5 9V16Z" fill="#29ABE2"/>
                            </g>
                        </svg>Delete</button>
                    </div>
                </div>
            </div>
            <p class="inter-extralight contact-main-infotext">Contact Information</p>
            <div class="contact-main-details">
                <div class="contact-main-details-email">
                    <span class="inter-medium">Email</span>
                    <span class="inter-extralight">${email}</span>
                </div>
                <div class="contact-main-details-phone">
                    <span class="inter-medium">Phone</span>
                    <span class="inter-extralight">${phone}</span>
                </div>
            </div>
        </div>
        <div class="contact-main-controls-btn" onclick="toggleEditMenu()" id="menuButton">
            <img src="./assets/svg/more-vert.svg" alt="">
        </div>
    `;
}

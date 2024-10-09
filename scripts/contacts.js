const API_URL = firebaseConfig.apiKey;
let contacts;

async function init() {
  await getData(API_URL);
  await renderContacts();
}

async function getData(url) {
  const data = await fetchData(url + ".json");
  contacts = data.contacts || [];
}

async function renderContacts() {
  const contactList = document.getElementById("contactList");
  if (!contactList) return;

  console.log(contacts);

  contactList.innerHTML = contacts
    .map((contact) => {
      const initials = getInitialsFromContact(contact);
      return getContactTemplate(initials, contact.name, contact.email);
    })
    .join("");
}

function getInitialsFromContact({ name }) {
  const [firstName, lastName] = name.split(" ");
  const firstInitial = firstName.charAt(0);
  const lastInitial = lastName.charAt(0);
  return `${firstInitial}${lastInitial}`;
}

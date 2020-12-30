// Select DOM elements to work with
const headerDiv = document.getElementById("headerMessage");
const signInButton = document.getElementById("signIn");
const signOutButton = document.getElementById('signOut');
const profileDiv = document.getElementById("profile-div");
const addClassDiv = document.getElementById("add-class-div");


function showWelcomeMessage(account) {
  headerDiv.innerHTML = headerDiv.innerHTML + ` (${account.name})`;
    signInButton.classList.add('d-none');
    signOutButton.classList.remove('d-none');
    addClassDiv.classList.remove('d-none');
}

function updateUI(data, endpoint) {
  console.log('Graph API responded at: ' + new Date().toString());

  if (endpoint === graphConfig.graphMeEndpoint) {
    const title = document.createElement('p');
    title.innerHTML = "<strong>Title: </strong>" + data.jobTitle;
    const email = document.createElement('p');
    email.innerHTML = "<strong>Mail: </strong>" + data.mail;
    const phone = document.createElement('p');
    phone.innerHTML = "<strong>Phone: </strong>" + data.businessPhones[0];
    const address = document.createElement('p');
    address.innerHTML = "<strong>Location: </strong>" + data.officeLocation;
    profileDiv.appendChild(title);
    profileDiv.appendChild(email);
    profileDiv.appendChild(phone);
    profileDiv.appendChild(address);
  } else if(endpoint == graphConfig.addClassEndpoint) {
    const title = document.createElement('p');
    title.innerHTML = "<strong>Title: </strong>" + data.jobTitle;
    profileDiv.appendChild(title);
  }
 
}
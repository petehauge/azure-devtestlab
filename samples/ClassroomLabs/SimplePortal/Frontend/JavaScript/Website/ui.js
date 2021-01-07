// Config object to be passed to Msal on creation.
// For a full list of msal.js configuration parameters, 
// visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_authenticationparameters_.html
const msalConfig = {
  auth: {
    clientId: "d3dfb31e-bfd8-41bb-9653-a32cdfe0df51",
    authority: "https://login.microsoftonline.com/organizations",
    redirectUri: "http://localhost:3000/",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  }
};  
  
// Add here the scopes to request when obtaining an access token for MS Graph API
// for more, visit https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core/docs/scopes.md
const loginRequest = {
  scopes: ["openid", "profile", "User.Read"]
};

// Add here the endpoints here
const endpointsConfig = {
  classes: {
    url: "https://simple-portal-api.azure-api.net/simpleportal/classes",
    method: "GET",
  },
  addClass: {
    url: "https://simple-portal-api.azure-api.net/simpleportal/classes/create", 
    method: "POST",
  }
};

// Helper function to call service API endpoint 
// using authorization bearer token scheme
function callService(endpoint, token, callback) {
  const headers = new Headers();
  const bearer = `Bearer ${token}`;
  
  headers.append("Authorization", bearer);

  const options = {
      method: endpoint.method,
      headers: headers
  };

  console.log(endpoint.method + ' request made to API at: ' + new Date().toString());
  
  fetch(endpoint.url, options)
    .then(response => response.json())
    .then(response => callback(response, endpoint))
    .catch(error => {
      console.log(error);
      messagesDiv.innerText = error;
    });
}

// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new Msal.UserAgentApplication(msalConfig); 

// Select DOM elements to work with
const signInButton = document.getElementById("signIn");
const signOutButton = document.getElementById('signOut');
const headerDiv = document.getElementById("headerMessage");
const addClassDiv = document.getElementById("add-class-div");
const messagesDiv = document.getElementById("messages-div");
const classesDiv = document.getElementById("classes-div");

let accessToken;

// Register Callbacks for Redirect flow
myMSALObj.handleRedirectCallback(authRedirectCallBack);

function authRedirectCallBack(error, response) {
  if (error) {
      console.log(error);
  } else {
      if (response.tokenType === "id_token") {
          console.log("id_token acquired at: " + new Date().toString()); 
          
          if (myMSALObj.getAccount()) {
            showWelcomeMessage(myMSALObj.getAccount());
          }

      } else if (response.tokenType === "access_token") {
        console.log("access_token acquired at: " + new Date().toString());
        accessToken = response.accessToken;
      } else {
          console.log("token type is:" + response.tokenType);
      }
  }
}

/*
if (myMSALObj.getAccount()) {
  showWelcomeMessage(myMSALObj.getAccount());
}
*/

function signIn() {
  myMSALObj.loginRedirect(loginRequest);
}

function signOut() {
  myMSALObj.logout();
}

function showWelcomeMessage(account) {
  signInButton.classList.add('d-none');
  signOutButton.classList.remove('d-none');
  headerDiv.classList.remove('d-none');
  headerDiv.innerHTML = `Welcome, ${account.name}!`;
  addClassDiv.classList.remove('d-none');
  displayClasses();
}

function updateUI(data, endpoint) {
  console.log('Graph API responded at: ' + new Date().toString());

  if(endpoint == endpointsConfig.classes) {
    const msg = document.createElement('p');
    msg.innerHTML = "<strong>Classes: </strong>" + data;
    classesDiv.appendChild(msg);
  } else if(endpoint == endpointsConfig.addClass) {
    const msg = document.createElement('p');
    msg.innerHTML = "<strong>Class added! </strong>" + data;
    messagesDiv.appendChild(msg);
  }
}

function displayClasses() {
  getTokenRedirect(loginRequest, endpointsConfig.classes);
}

function addClass() {
  getTokenRedirect(loginRequest, endpointsConfig.addClass);
}

// This function can be removed if you do not need to support IE
function getTokenRedirect(request, endpoint) {
  return myMSALObj.acquireTokenSilent(request)
      .then((response) => {
        console.log(response);
        if (response.accessToken) {
            console.log("access_token acquired at: " + new Date().toString());
            accessToken = response.accessToken;

            if (accessToken) {
              try {
                callService(endpoint, accessToken, updateUI);
              } catch(err) {
                console.log(err)
              } finally {
                //profileButton.classList.add('d-none');
              }
            }
        }
      })
      .catch(error => {
          console.log("silent token acquisition fails. acquiring token using redirect");
          // fallback to interaction when silent call fails
          return myMSALObj.acquireTokenRedirect(request);
      });
}
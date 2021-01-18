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
    url: msalConfig.auth.redirectUri + "api/classes",
    method: "GET"
  },
  addClass: {
    url: msalConfig.auth.redirectUri + "api/classes/create",
    method: "POST",
    data: {}
  }
};

// Helper function to call service API endpoint 
// using authorization bearer token scheme
function callService(endpoint, token, callback) {

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);

  var body = null;
  if(endpoint.method != "GET") {
    body = JSON.stringify(endpoint);
  }

  const options = {
    method: endpoint.method, // GET, POST, PUT, DELETE, etc.
    headers: headers,
    body: body
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
const bodyDiv = document.getElementById('body-div');
const bodyTitleDiv = document.getElementById("body-title-div");
const showAddClassBtn = document.getElementById("show-add-class-btn");
const classesDiv = document.getElementById("classes-div");
const addClassDiv = document.getElementById("add-class-div");
const messagesDiv = document.getElementById("messages-div");

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

if (myMSALObj.getAccount()) {
  showWelcomeMessage(myMSALObj.getAccount());
}

function signIn() {
  myMSALObj.loginRedirect(loginRequest);
}

function signOut() {
  myMSALObj.logout();
}

function showWelcomeMessage(account) {
  signInButton.classList.add('d-none');
  signOutButton.classList.remove('d-none');
  bodyDiv.classList.remove('d-none');
  bodyTitleDiv.innerHTML = `Welcome, ${account.name}!`;
  displayClassesFunction();
}

function updateUI(data, endpoint) {
  var dataString = JSON.stringify(data);
  console.log('Graph API responded at: ' + new Date().toString());

  if (endpoint == endpointsConfig.addClass) {
    messagesDiv.innerHTML = "<strong>Class added! </strong>";
  }

  // Print the classes
  const p = document.createElement('p');
  for(var i = 0; i<data.length; i++){
    var div1 = document.createElement('div');
    div1.innerText = data[i].id;
    p.appendChild(div1);
    
    var div2 = document.createElement('div');
    div2.innerText = data[i].name;
    p.appendChild(div2);
    
    var div3 = document.createElement('div');
    div3.innerText = data[i].description;
    p.appendChild(div3);

    var div4 = document.createElement('div');
    div4.innerText = data[i].classtype;
    p.appendChild(div4);

    var div5 = document.createElement('div');
    div5.innerText = data[i].size;
    p.appendChild(div5);
  };

  classesDiv.innerHTML = p.innerHTML;
}

function displayClassesFunction() {
  getTokenRedirect(loginRequest, endpointsConfig.classes);
}

function addClassFunction() {
  endpointsConfig.addClass.data = { "name": "hi hi hooo!" };
  getTokenRedirect(loginRequest, endpointsConfig.addClass);
}

function addClassShow() {
  showAddClassBtn.classList.add('d-none');
  addClassDiv.classList.remove('d-none');
  messagesDiv.innerText = null;
}

function addClassBack() {
  showAddClassBtn.classList.remove('d-none');
  addClassDiv.classList.add('d-none');
  messagesDiv.classList.remove('d-none');
  messagesDiv.innerText = null;
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
          } catch (err) {
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
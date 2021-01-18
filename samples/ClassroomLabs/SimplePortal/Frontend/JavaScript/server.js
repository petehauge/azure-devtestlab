const bodyparser = require('body-parser') 
const express = require('express');
const path = require('path');

//initialize express.
const app = express();

// Initialize variables.
const port = 3000; // process.env.PORT || 3000;

// Set the front-end folder to serve public assets.
app.use(express.static('Website'));

// Body-parser middleware 
app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json()) 

// Routes are defined in the routes.js file
var routes = require(path.join(`${__dirname}/Website/routes.js`))(app);

// Set up a route for index.html.
app.get('*', function (req, res) {
    res.sendFile(path.join(`${__dirname}/index.html`));
});

// Start the server.
var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});
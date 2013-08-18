#!/usr/bin/env node

/*
 * nodejs code
 */
var express = require('express');
var app = express();
var exec = require("child_process").exec;

// configure express
app.configure(function() {
	"use strict";
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


// setup page to serve to browser
app.get('/', function(req, res) {
	"use strict";
	res.render('index', { pageTitle: "Login Tradera.se" });
});
// setup handler for username|password
app.get('/login', function(req, res) {
	"use strict";
	// login
	login(req.query.Username, req.query.Password);	
	res.render('index', { pageTitle: "YAY!! tradera.se" });
});

// start express
app.listen(3069);
// start browser
startBrowser("http://localhost:3069/");

function login(username, password) {
	// start casperjs
	exec("casperjs tradera.js "+username+" "+password, function(error, stdout, stderr) {
		"use strict";

		// print info to terminal about WTF is going on
		log(stdout);
		// if(error !== null && stderr !== null) {
		// 	var msg = JSON.stringify(error || stderr);
		// 	console.log(msg);
		// 	die(msg);
		// }
	});
}

function startBrowser(url) {
	switch (process.platform) {
		case "win32":
			exec('start "" ' + url
			// , function(error, stdout, stderr) {
			// 	log(stdout);
			// 	if(error !== null && stderr !== null) {
			// 		res.end(error || stderr);
			// 		die(error || stderr);
			// 	}
			// }
			);
			break;
		case "linux":
			exec('xdg-open ' + url);
			break;
		case "darwin":
			exec('open ' + url);
			break;
		case "freebsd":
		case "sunos":
			console.log("You have to manually open your browser");
	}
}

function die(data) {
	log(data);
	exit(1);
}

function log(msg) {
	process.stdout.write(msg);
}

function exit(code) {
	process.exit(code || 0);
}

/*
 * CasperJS code
 */

var casper = require('casper').create();
	// ,	uaString = '';
var dump = require("utils").dump;

// Doesn't seem to work with casperJS 1.1 - bug
var captureOptions = {
	width: 640,
	height: 460
}

var user = {
	Username:casper.cli.args[0],
	Password:casper.cli.args[1]
}

// removing default options passed by the Python executable
// casper.cli.drop("cli");
// casper.cli.drop("casper-path");

// if (casper.cli.args.length === 0 && Object.keys(casper.cli.options).length === 0) {
//     casper
//         .echo("Username and password is required. Exiting...");
//         .exit(1)
//     ;
// }

function log(msg) {
	// dump('{"data":"' + msg + '"}');
	dump(msg);
}

function getUA() {
	return document.querySelector('textarea[name="Fuas"]').value;
}
function setUA(uastring) {
	return casper.userAgent(uastring.replace(/CasperJS.*\s/,''));
}

/* Spoof our user agent string by removing
   CasperJS and PhantomJS, so Tradera won't notice us */
casper.start('http://user-agent-string.info/parse', function() {
    // this.echo(this.getTitle());
    setUA(this.evaluate(getUA));
    log("Changing user-agent-string");
    //this.capture('analyse.png');
    // uaString = this.evaluate(getUA);
    // this.echo("user-agent-string was: " + uaString);
    // this.echo("\r\nuser-agent-string IS: " + uaString.replace(/CasperJS.*\s/,''));
});
/* Test that our spoof attempt succeed */
// casper.thenOpen('http://user-agent-string.info/parse', function() {
//     this.echo(this.getTitle());
//     // this.capture('analyse.png');
//     this.echo(this.evaluate(getUA));
// });

/* Login to tradera.se */
casper.thenOpen('https://www.tradera.com/MemberManagement/Login/Login', function() {
    log(this.getTitle());
    this.fill('form[action="/MemberManagement/Login/Login"]', user);
    this.capture("public/images/tradera1.png");
    this.click('#submit-button');
});

/*  */
casper.waitForUrl('http://www.tradera.com/firstpage.mvc/index', function() {
	this.capture("public/images/tradera2.png");
	this.die("Done");
});

casper.run();

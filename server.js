var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var hbs = require('hbs');
var request = require('request');
require('dotenv').load();
//requiring dependences for auth 
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

//mongoose
var mongoose = require('mongoose');

//require post model
var Post = require('./models/post'); //collection name posts is always plural
//require user model
var User = require('./models/user');
//trying to get variable userInput from client side
// var userInput = Request.Form['variable_name'];

//CONNECTING MONGODB TO HEROKU
mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/beerme'
);

//middleware for auth
app.use(cookieParser());
app.use(session({
	secret: 'supersecretkey',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//passport config - allows users to sign up/login/logout
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//view engine
app.use(express.static('public'));
app.set('view engine', 'hbs');
//configuring bodyParser
app.use(bodyParser.urlencoded({
	extended: true
}));


//https://api.foursquare.com/v2/venues/search?client_id=JED5OVLWQ5VGMRWXEVPXPCTB25E401FXA1XJEGPHOZ04GJWP&client_secret=BJM5UC3CJTSTAS0GVJVSZOGIIASAQBZQ2JJSYCLHVTRKKPJL&v=20130815&near=san%20francisco&query=brewery'																																									//variable from main.js that gets value of userInput						
//var baseUrl = 'https://api.foursquare.com/v2/venues/search?client_id=' + process.env.FOURSQUARE_ID + '&client_secret=' + process.env.FOURSQUARE_SECRET + '&v=20130815&near=' + userInput + '&query=brewery';
//var baseUrl = 'https://api.foursquare.com/v2/venues/search?client_id=' + process.env.FOURSQUARE_ID + '&client_secret=' + process.env.FOURSQUARE_SECRET + '&v=20130815&near=san%20francisco&query=brewery';
var baseUrl = 'https://api.foursquare.com/v2/venues/search?client_id=' + process.env.FOURSQUARE_ID + '&client_secret=' + process.env.FOURSQUARE_SECRET + '&v=20130815&near=';// + userInput + '&query=brewery';


//var userSearch = Request.Form["<userInput>"];
//ROUTES
//HOMEPAGE ROUTE
app.get('/', function(req, res) {
	res.render('index');
});



//requesting foursquare api TRYING TO GET CLIENT SIDE VARIABLE USERINPUT PRACTICE ONLY
app.get('/search', function(req, res) {

	var url = req.query.search;


	request(baseUrl + url + '&query=brewery', function(error, response, body) {
		res.json({
			breweries: JSON.parse(body).response.venues
		}); //body must be parsed first before calling
	});

});


// //requesting foursquare api
// app.get('/search', function(req, res) {
// 	request(baseUrl, function(error, response, body) {
// 		res.json({
// 			breweries: JSON.parse(body).response.venues
// 		}); //body must be parsed first before calling
// 	});

// });

//SIGN UP ROUTE
app.get('/signup', function(req, res) {
	res.render('signup');
});
//signs up new user, then logs them in
//hashes and salts password, saves new user to db
app.post('/signup', function(req, res) {
	User.register(new User({
			username: req.body.username
		}), req.body.password,
		function(err, newUser) {
			passport.authenticate('local')(req, res, function() {
				res.redirect('/profile');
			});
		}
	);
});
//log in route
app.get('/login', function(req, res) {
	res.render('login');
});
//route to handle logging in existing users
app.post('/login', passport.authenticate('local'), function (req, res) {
	res.redirect('/profile');
});

//logout user
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});
//show user their profile page
app.get('/profile', function(req, res) {
	res.render('profile', {user: req.user});
});















var server = app.listen(process.env.PORT || 3000, function() {
	console.log("I LOVE BEER");
});
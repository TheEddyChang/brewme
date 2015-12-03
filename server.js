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
var Brewery = require('./models/brewery'); //collection name posts is always plural
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
//variable from main.js that gets value of userInput
//var baseUrl = 'https://api.foursquare.com/v2/venues/search?client_id=' + process.env.FOURSQUARE_ID + '&client_secret=' + process.env.FOURSQUARE_SECRET + '&v=20130815&near=' + userInput + '&query=brewery';
//var baseUrl = 'https://api.foursquare.com/v2/venues/search?client_id=' + process.env.FOURSQUARE_ID + '&client_secret=' + process.env.FOURSQUARE_SECRET + '&v=20130815&near=san%20francisco&query=brewery';
var baseUrl = 'https://api.foursquare.com/v2/venues/search?client_id=' + process.env.FOURSQUARE_ID + '&client_secret=' + process.env.FOURSQUARE_SECRET + '&v=20130815&near='; // + userInput + '&query=brewery';
//var breweryUrl = 'https://api.foursquare.com/v2/venues/' + breweryId + 'search?client_id=' + process.env.FOURSQUARE_ID + '&client_secret=' + process.env.FOURSQUARE_SECRET + '&v=20130815';
//ROUTES
//database route
app.get('/api/beerme/', function(req, res) {
	User.find(function(err, allUsers) {
		res.json({
			User: allUsers
		});
	});

});
//HOMEPAGE ROUTE
app.get('/', function(req, res) {
	res.render('index');
});
//requesting foursquare api TRYING TO GET CLIENT SIDE VARIABLE USERINPUT PRACTICE ONLY
app.get('/search', function(req, res) {
	//gets variable from client side
	var url = req.query.search;
	request(baseUrl + url + '&query=brewery', function(error, response, body) {
		res.json({
			breweries: JSON.parse(body).response.venues
		}); //body must be parsed first before calling
	});
});

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
app.post('/login', passport.authenticate('local'), function(req, res) {
	res.redirect('/profile');
});
//logout user
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});
//show user their profile page
app.get('/profile', function(req, res) {

	// 1. use current user to access database to get user info
	// 2. part of that info is all the breweries associated with the user
	// 3. use user breweires ids [array] [ 565fa95ef9a5513b023582fb,
	//     565faa1eff5f0d5002d5c953,
	//     565fb4ca26a0247402b5650e,
	//     565fb5d826a0247402b5650f ] to make a call to the brewery db 
	//     4. get all the brews from the brewery ids 
	//     5. push those breweries into the page
	res.render('profile', {
		user: req.user,
		//brewerys: [{},{}]
	});
	//populate(brewerys)
});


//posting saved brewery
app.post('/api/brewerys', function(req, res) {
	var breweryId = req.body.foursquare_id;
	console.log(breweryId);
	request('https://api.foursquare.com/v2/venues/' + breweryId + '?client_id=' + process.env.FOURSQUARE_ID + '&client_secret=' + process.env.FOURSQUARE_SECRET + '&v=20130815', function(err, response, body) {
		console.log(body);
		console.log('name:' + JSON.parse(body).response.venue.name);
		var newBrewery = new Brewery({
			name: JSON.parse(body).response.venue.name,
			contact: JSON.parse(body).response.venue.contact.phone,
			location: JSON.parse(body).response.venue.location.formattedAddress,
			url: JSON.parse(body).response.venue.url
		});
		newBrewery.save(function(err, savedBrewery) {
			if (err) {
				res.status(500).json({
					error: err.message
				});
			} else {
				res.json(savedBrewery);
			}
		});
	});
});
//save new brewery in db
//finding logged in user
// User.findOne({
// 	_id: req.user._id
// });
// Brewery.findOne({
// 	_id: req.brewery._id
// });

//user.brewerys.push(foundBrewery);
//

//user.save();
app.put('/api/users/favorites', function(req, res) {
	//REFERENCING DATA
	console.log("heyy");
	console.log(req.user._id); //current users id
	var breweryMongoId = req.body.brewery_id;
	User.findOne({

		_id: req.user._id //finds logged in user
	}, function(err, user) {
		console.log("the user:", user);
		user.brewerys.push(breweryMongoId);
		//user.brewerys.push(breweryName);
		console.log('the user 2:', user);
		user.save();
		res.json(user); //goes back to client
	});
	//user doesnt exist here..only inside callback


});



//gets users favorites if they have any
app.get('/api/users/favorites', function(req, res) {
	//REFERENCING DATA
	User.findOne({
			_id: req.user._id //finds logged in user
		})
		.populate('brewerys')
		//find the brewery favorites
		.exec(function(err, user) {
			if (err) {
				return console.error(err);
			}
			if (user.brewerys.length > 0) {
				for (var i = 0; i < user.brewerys.length; i++) {
					console.log(brewery.name);
				}
			} else {
				console.log('User has no brewerys saved');
			}
			console.log(user);
		});

});



// app.post('/api/user/:id/favorites', newBrewery, function(data) {
// 	brewerys.findOne({
// 		_id: req.user._id


// 	function(err, newBrewery) {
// 		brewery.push(newBrewery);
// 	};
// });
// });



// });

//1) find a brewery by id in request body
//2)in the callback, find the user by id
//3) add the found brewery to that user list of breweries
//4)save user
//5)return the brewery using json


var server = app.listen(process.env.PORT || 3000, function() {
	console.log("I LOVE BEER");
});
//POST 
var mongoose = require('mongoose'),
Schema = mongoose.Schema;


var BrewerySchema = new Schema({
	name: String,
	contact: String,
	location: String,
	url: String,
	foursquare_id: String
});

var Brewery = mongoose.model('Brewery', BrewerySchema);

module.exports = Brewery; //allows us to use this in server.js
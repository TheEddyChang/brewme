var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');
//defining User Schema
var UserSchema = new Schema({
	username: String,
	password: String
});


//adding passPortLocalMongoose - takes care of hashtag/salting plain-tet password
UserSchema.plugin(passportLocalMongoose);
//creating user model and exporting it
var User = mongoose.model('User', UserSchema);
module.exports = User;

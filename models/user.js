var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');
//defining User Schema
var UserSchema = new Schema({
	username: String,
	password: String,
	//favorties: letting userschema know each user will have an array of brewerys in it
	brewerys:[{type:Schema.Types.ObjectId, ref: 'Brewery'}]
	//comments: [Comment.Schema]

});

var validatePassword = function(password, callback) {
	if (password.length < 6) {
		return callback ({ code: 422, message: "Password must be at least 6 characters"});
	}
	return callback(null);
};


//adding passPortLocalMongoose - takes care of hashtag/salting plain-tet password
UserSchema.plugin(passportLocalMongoose, {
	populateFields: 'brewerys',//puts info on profile page
	passwordValidator: validatePassword
}
);

//creating user model and exporting it
var User = mongoose.model('User', UserSchema);
module.exports = User;

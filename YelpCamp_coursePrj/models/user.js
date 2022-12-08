const { string } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
	email: {
		type: string,
		required: true,
		uniquie: true
	}
});

// adds a unique value for the username and for password
UserSchema.plugin(passportLocalMongoose);

module.exports = UserSchema;
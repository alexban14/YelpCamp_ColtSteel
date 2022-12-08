const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		requires: [true, 'Username cannot be blank']
	},
	password: {
		type: String,
		requires: [true, 'Password cannot be blank']
	}
});

// we can define methods thatwill be added to the user class itself
userSchema.statics.findAndValidate = async function(username, password) {
	const foundUser = await this.findOne({ username });
	const isValid = await bcrypt.compare(password, foundUser.password);
	return isValid ? foundUser : false;
}

// middleware before a user is saved
userSchema.pre('save', async function (next) {
	if(!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

module.exports = mongoose.model('User', userSchema);
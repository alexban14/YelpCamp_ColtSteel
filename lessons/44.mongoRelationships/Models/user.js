// ONE TO ONE DATA RELATIONSHIP
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/data-relationship')
    .then(() => {
        console.log("MONGO Connection open!");
    })
    .catch(err => {
        console.log("MONGO connection ERROR!");
        console.log(err)
    });

const userSchema = new mongoose.Schema({
	first: String,
	last: String,
	addresses: [
		{
			// to turn off mongo auto ID - ing 
			// _id: {id: false},
			street: String,
			city: String,
			state: String,
			country: String
			// country: {
			// 	type: String,
			// 	required: true
			// }
		}
	]
});

const User = mongoose.model('User', userSchema);

const makeUser = async () => {
	const u = new User({
		first: 'Ban',
		last: 'Alex'
	});
	u.addresses.push({
		street: '123 Sesame St.',
		city: 'New York',
		state: 'NY',
		country: 'USA',
	});
	const res = await u.save();
	console.log(res);
}

const addAddress = async (id) => {
	const user = await User.findById(id);
	user.addresses.push(
		{
			street: '99 3rd St.',
			city: 'New York',
			state: 'NY',
			country: 'USA',
		}
	);
	const res = await user.save();
	console.log(res);
}

// makeUser();
addAddress('638b3e5bdd0973fbf37ed86e');
// ONE TO BAJILIONS DATA RELATIONSHIP
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect('mongodb://127.0.0.1:27017/data-relationship')
    .then(() => {
        console.log("MONGO Connection open!");
    })
    .catch(err => {
        console.log("MONGO connection ERROR!");
        console.log(err)
    });

const userSchema = new Schema({
	username: String,
	age: Number,
});

const tweetSchema = new Schema({
	text: String,
	likes: Number,
	user: {type: Schema.Types.ObjectId, ref: 'User'}
});

const User = mongoose.model('User', userSchema);
const Tweet = mongoose.model('Tweet', tweetSchema);

// const makeTweets = async () => {
// 	const u = new User({ username: 'chickenfanBoy', age: 61});
// 	const tweet1 = new Tweet({ text: 'OMG i like my chicken family so much', likes: 999 });
// 	tweet1.user = u;
// 	await u.save();
// 	await tweet1.save();
// };

// makeTweets();

const findTweet = async () => {
	const t = await Tweet.findById({_id: '638b5115eeecbb9fc55f2dd1'}).populate('user', 'username');
	console.log(t);
};
findTweet();
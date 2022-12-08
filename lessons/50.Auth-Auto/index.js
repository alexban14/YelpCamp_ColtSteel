const express = require('express');
const app = express();
const mongoose = require('mongoose')
const session = require('express-session');
const User = require('./models/user');
const bcrypt = require('bcrypt');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/bcryptDemo')
    .then(() => {
        console.log("MONGO Connection open!");
    })
    .catch(err => {
        console.log("MONGO connection ERROR!");
        console.log(err)
    });

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(session({
	secret: 'notagoodsecret',
	resave: false,
	saveUninitialized: false
}));

// const requireLogin = (req, res, next) => {
// 	// if(req.hasOwnProperty(session.user_id) === false) {
// 	if(req.session.user_id === false) {
// 		res.redirect('/login');
// 	} else {
// 		next();
// 	}
// }

app.get('/', (req, res) => {
	res.send('THIS IS THE HOME PAGE');
});

// signup
app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', async (req, res) => {
	const { password, username } = req.body;
	const user = new User({ username, password });
	await user.save();
	req.session.user_id = user._id;
	res.redirect('/');
});

// login
app.get('/login', (req, res) => {
	res.render('login');
});

app.post('/login', async (req, res) => {
	const { password, username } = req.body;
	const foundUser = await User.findAndValidate(username, password);
	if(foundUser) {
		req.session.user_id = foundUser._id;
		res.redirect('/secret');
	} else {
		res.send('TRY AGAIN');
	}
});

// logout
app.post('/logout', (req, res) => {
	// req.session.user_id = null;
	req.session.destroy();
	res.redirect('/login');
});

app.get('/secret', (req, res) => {
	if(!req.session.user_id) {
		res.redirect('/login')
	} else {
		res.render('secret');
	}
});


app.listen(3000, () => {
	console.log('ON PORT 3000');
});
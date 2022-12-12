const express = require('express');
const passport = require('passport');
const router = express.Router();

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
	res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const user = new User({ username, email});
		const registeredUser = await User.register(user, password);
		console.log(registeredUser);
		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash('success', 'Welcom to Yelp Camp!');
			res.redirect('/campgrounds');
		});
	} catch(e) {
		req.flash('error', e.message);
		res.redirect('/register');
	}
}));

router.get('/login', (req, res) => {
	res.render('users/login');
});

// passport login middleware
router.post('/login', passport.authenticate('local', {
	failureFlash: true,
	failureRedirect: '/login',
	keepSessionInfo: true 
}),
(req, res) => {
	req.flash('success', 'Welcome back!');
	// redirect the user to the page he was trying to access
	const redirectUrl = req.session.returnTo || '/campgrounds';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
	req.logout((err) => {
		if(err) {
			return next(err)
		}
		req.flash('success', 'Goodbye!');
		res.redirect('/campgrounds');
	});
});

module.exports = router;
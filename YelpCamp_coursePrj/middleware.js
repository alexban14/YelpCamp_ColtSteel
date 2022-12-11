module.exports.isLoggedIn = (req, res, next) => {
	// middleware provided by passport
    if(!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
	next();
}
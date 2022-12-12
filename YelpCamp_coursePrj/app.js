const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user');
const ExpressError = require('./utils/ExpressError');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("MONGO Connection open!");
    })
    .catch(err => {
        console.log("MONGO connection ERROR!");
        console.log(err)
    });

// ejs template engine (for layouts, partials, blocks)
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// telling express what folder we are using to serve static files
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
// middleware for persisten loggin sessions
// needs to be after configuring session
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// // serialization = how to store the user in a session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.get('/user', async (req, res) => {
    const user = new User({
        email: 'alex@gmail.com',
        username: 'alexBanCon'
    });
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
});


app.get('/', (req, res) => {
	res.render('home');
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes)


// error handeling
app.all('*', (req, res, next) => {
    throw new ExpressError('Page Not Found', 404);
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no something went wrong';
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
	console.log('On port 3000!')
});
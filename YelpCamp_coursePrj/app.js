const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Joi = require('joi');

const Review = require('./models/review');
const Campground = require('./models/campground');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("MONGO Connection open!");
    })
    .catch(err => {
        console.log("MONGO connection ERROR!");
        console.log(err)
    });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ejs template engine (for layouts, partials, blocks)
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extened: true }));
app.use(methodOverride('_method'));

// object validation based on on Joi schema
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
	res.render('home');
});

// route to GET ALL campground
app.get('/campgrounds', catchAsync(async (req, res) => {
	const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

// route to MAKE NEW campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
    // if(!campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

// route to GET ONE campground
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    // const campground = await Campground.findOne({ _id: id });
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', { campground });
}));

// route to CHANGE ONE campground
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}));

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}));

// route to DELETE ONE campground
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findOneAndDelete(id);
    res.redirect('/campgrounds');
}));

// reviews routes
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    // $pull operator removes from an existing array all instances of a value
    // that match a specified condition
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));


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
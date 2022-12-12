const express = require('express');
// all params from app.js will merge with the ones in here
const router = express.Router({ mergeParams: true });

const Review = require('../models/review');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware'); 


// reviews routes
router.post('/', isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    // $pull operator removes from an existing array all instances of a value
    // that match a specified condition
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

// route to GET ALL campground
router.route('/')
	.get(catchAsync(campgrounds.index))
	// .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
	.post(upload.single('image'), (req, res) => {
		res.send(req.body, req.file);
	});

// route to MAKE NEW campground
router.get('/new', isLoggedIn , campgrounds.renderNewForm);

router.route('/:id')
	.get(catchAsync(campgrounds.showCampground))
	.put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.destroyCampground));

// route to CHANGE ONE campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

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

app.use(express.urlencoded({ extened: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
	res.render('home');
});

// route to GET ALL campground
app.get('/campgrounds', async (req, res) => {
	const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

// route to MAKE NEW campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

// route to GET ONE campground
app.get('/campgrounds/:id', async (req, res) => {
    const id = req.params.id;
    // const campground = await Campground.findOne({ _id: id });
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
});

// route to CHANGE ONE campground
app.get('/campgrounds/:id/edit', async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
});

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
});

// route to DELETE ONE campground
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndRemove(id);
    res.redirect('/campgrounds');
});


app.listen(3000, () => {
	console.log('On port 3000!')
});
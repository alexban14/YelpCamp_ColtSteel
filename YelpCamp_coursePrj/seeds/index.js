const mongoose = require('mongoose');
const axios = require('axios');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("MongoDB connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

async function seedImg() {
	try {
	  const resp = await axios.get('https://api.unsplash.com/photos/random', {
		params: {
		  client_id: 'bpGP9X197BhHUyKwCQsGlVGcE7o5IVQSYbSbuu6jvVg',
		  collections: 1114848,
		},
	  })
	  console.log(resp.data.urls['small']);
	} catch (err) {
	  console.error(err)
	}
};

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure laborum iste non et nisi itaque. Voluptatibus iusto tempora necessitatibus, magni consectetur optio, cum quibusdam est laudantium, molestiae a reiciendis architecto!',
            price: price
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
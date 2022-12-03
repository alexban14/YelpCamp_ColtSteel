// ONE TO MANY DATA RELATIONSHIP
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

const productSchema = new Schema({
	name: String,
	price: Number,
	season: {
		type: String,
		enum: ['Spring', 'Summer', 'Fall', 'Winter']
	}
});

const farmSchema = new Schema({
	name: String,
	city: String,
	products: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Product'
		}
	]
});

const Product = mongoose.model('Product', productSchema);
const Farm = mongoose.model('Farm', farmSchema);

// Product.insertMany([
// 	{ name: 'Goddess Melon', price: 4.99, season: 'Summer'},
// 	{ name: 'Sugar Baby Watermelon', price: 4.99, season: 'Summer'},
// 	{ name: 'Asparagus', price: 3.99, season: 'Spring'}
// ]);

const makefarm = async () => {
	const farm = new Farm({
		name: 'Full Belly Farms',
		city: 'Guinda CA'
	});
	const melone = await Product.findOne({name: 'Goddess Melon'});
	farm.products.push(melone);
	await farm.save();
	console.log(farm);
};
// makefarm();

Farm.findOne({name: 'Full Belly Farms'})
	.populate('products')
	.then(farm => console.log(farm));
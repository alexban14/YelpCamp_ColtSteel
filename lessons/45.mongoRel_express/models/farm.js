const mongoose = require('mongoose');
const { Schema } = mongoose;
const Product = require('./product');

const farmSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Farm must have a name']
	},
	city: {
		type: String
	},
	email: {
		type: String,
		required: [true, 'Email required']
	},
	products: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Product'
		}
	]
});

// MONGOOSE MIDDLEWARE to delete subsequent products of one farm
farmSchema.pre('findOneAndDelete', async (farm) => {
	if(farm.products) {
		const res = Product.deleteMany({_id: {$in: farm.products}});
		console.log(res);
	}
});

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;
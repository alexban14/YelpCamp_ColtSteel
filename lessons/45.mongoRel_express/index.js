const express = require('express');
const app = express();
// module built into express, gives us methods
// that have to do file/directory paths 
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// requiring the model
const Product = require('./models/product');
const Farm = require('./models/farm');

mongoose.connect('mongodb://127.0.0.1:27017/farmStandTake2')
    .then(() => {
        console.log("MONGO Connection open!");
    })
    .catch(err => {
        console.log("MONGO connection ERROR!");
        console.log(err)
    });

// setting up the views dir to be accesed form anywhere,
app.set('views', path.join(__dirname, 'views'));
//setting view engine to ejs for templating
app.set('view engine', 'ejs');

// telling exprese how to parse the req.body
app.use(express.urlencoded({ extended: true }));
// for parsing json
app.use(express.json());
app.use(methodOverride('_method'));
// calle public to serve any images/css files/scripts
// setting up an absolute path to the "public" dir
app.use(express.static(path.join(__dirname, 'public')));

// FARM ROUTES
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms });
});

app.get('/farms/new', (req, res) => {
    res.render('farms/new');
});

app.get('/farms/:id', async (req, res) => {
    const id = req.params.id;
    const farm = await Farm.findById(id).populate('products');
    res.render('farms/show', { farm });
});

app.delete('/farms/:id', async(req, res) => {
    await Farm.findByIdAndDelete(req.params.id);
    res.redirect('/farms');
});

app.post('/farms', async (req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    res.redirect('/farms')
});

app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    res.render('products/new', { categories, farm });
});

app.post('/farms/:id/products', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    const { name, price, category } = req.body;
    const product = new Product({ name, price, category});
    farm.products.push(product);
    product.farm = farm;
    await product.save();
    await farm.save();
    res.redirect(`/farms/${id}`);
});

// PRODUCT ROUTES
// options to loop thru for edit and new page
const categories = ['fruit', 'vegetable', 'dairy'];

// setting up routs

// async rout handler, awaits for the products to be returned
// from mongo DB
app.get('/products', async (req, res) => {
    // filering by category (the query from the URL)
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category });
        res.render('products/index', { products, category });
    } else {
        const products = await Product.find({});
        // we pass thru, as a second argumrnt
        // the products that are sent from the DB 
        res.render('products/index', { products, category: 'All' });
    }
});

// creat product page rout
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
});
// posting to the DB the created product
app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    res.redirect(`/products/${newProduct._id}`);
});

// rout for showing details about a product
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/show', { product });
});

// find and updating one product routs
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories });
});
// findByIdAndUpdate put request
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.redirect(`/products/${product._id}`);
});

// findByAndDelete
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProd = await Product.findByIdAndRemove(id);
    res.redirect('/products');
});



app.listen(3000, () => {
    console.log('ON PORT 3000!');
});
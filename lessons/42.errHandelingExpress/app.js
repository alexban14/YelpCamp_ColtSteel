const express = require('express');
const app = express();
const morgan = require('morgan');

const AppError = require('./AppError');

// this is a MIDDELWARE, but its running om every singel request
// app.use(() => {
// 	console.log('HELLOOO');
// });

app.use(morgan('common'));

app.use((req, res, next) => {
	console.log(req.method.toUpperCase(), req.path);
	// req.method = 'GET';
	req.requestTime = Date.now();
	next();
});

app.use('/dogs', (req, res, next) => {
	console.log('I LOVE DOGS!!');
	next();
});

const verifyPassword = (req, res, next) => {
	const { password } = req.query;
	if(password === 'chickennugget') {
		next();
	}
	// res.send('SORRY YOU NEED A PASSWORD!')
	// res.status(401)
	// throw new Error('Password require!');
	throw new AppError('Password required!', 401);
};

app.get('/', (req, res) => {
	console.log(`REQUESTED DATE: ${req.requestTime}`);
	res.send('HOME PAGE!');
});

app.get('/error', (req, res) => {
	chicken.fly();
});

app.get('/dogs', (req, res) => {
	console.log(`REQUESTED DATE: ${req.requestTime}`);
	res.send('WOOF WOOF!');
});

app.get('/secret', verifyPassword, (req, res) => {
	res.send('MY SECRETE: Somtimes i dont wear underwear :D')
});

// a 404 route
app.use((req, res) => {
	res.status(404).send('NOT FOUND!');
});

// custom error handler
// app.use((err, res, req, next) => {
// 	console.log('*************************')
// 	console.log('*********ERROR***********')
// 	console.log('*************************')
// 	next(err);
// });

app.use((err, req, res, next) => {
	const { status = 500, message = 'Something went wrong!' } = err;
	res.status(status).send(message);
});


app.listen(3000, () => {
	console.log('Listening on PORT 3000!');
});

const express = require('express');
const app = express();
const morgan = require('morgan');

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
	res.send('SORRY YOU NEED A PASSWORD!');
};

app.get('/', (req, res) => {
	console.log(`REQUESTED DATE: ${req.requestTime}`);
	res.send('HOME PAGE!');
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

app.listen(3000, () => {
	console.log('Listening on PORT 3000!');
});

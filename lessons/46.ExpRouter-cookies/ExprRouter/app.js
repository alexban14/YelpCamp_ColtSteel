const express = require('express');
const app = express();
const shelterRoutes = require('./routes/shelter');
const adminRoutes = require('./routes/admin');

app.use('/shelters', shelterRoutes);
app.use('/admin', adminRoutes);

app.listen(3000, () => {
	console.log('On port 3000');
});
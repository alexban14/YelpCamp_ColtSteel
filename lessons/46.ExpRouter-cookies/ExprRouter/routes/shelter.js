const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.send('GET ALL SHELTTERS');
});

router.post('/', (req, res) => {
	res.send('CREATE SHELTTER');
});

router.get('/:id', (req, res) => {
	res.send('GET ONE SHELTTER');
});

router.get('/:id/edit', (req, res) => {
	res.send('EDIT ONE SHELTTER');
});

module.exports = router;
const express = require('express');
const moragn = require('morgan');
const createError = require('http-errors');
const cors = require('cors');
const bodyParser = require('body-parser')

const apiRoutes = require('./routes/api');

const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(moragn('dev'));

app.use('/api', apiRoutes);

// server's app.js
if (process.env.NODE_ENV === 'production') {
	app.use(express.static('frontend/build'));
	app.get('/', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
	});
}

app.use((req, res, next) => {
	next(createError(404));
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	if (res.status === 401) res.send('WWW-Authneticate', 'Bearer');

	res.json({
		message: err.message,
		error: JSON.parse(JSON.stringify(err)),
	});
});

module.exports = app;

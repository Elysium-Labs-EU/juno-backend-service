const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const indexRoute = require('./index');

const app = express();

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, sentry-trace'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, PATCH, OPTIONS'
	);
	next();
});

app.use(express.json());

app.use('/', indexRoute);

const swaggerDefinition = {
	info: {
		title: 'Juno API',
		version: '0.0.1',
		description:
			'This is a REST API application made with Express. It retrieves data from Gmail Api.',
		license: {
			name: 'Licensed under GNU General Public License v3.0',
			url: 'https://github.com/Elysium-Labs-EU/juno-backend/blob/main/LICENSE',
		},
		contact: {
			name: 'Robbert Tuerlings',
			url: 'https://robberttuerlings.online',
		},
	},
};

// Swagger Configuration
const swaggerOptions = {
	swaggerDefinition,
	apis: ['./index.js', './doc/definitions.yaml'],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

module.exports = app;

const PORT = process.env.PORT || 5001;
const http = require('http');
const application = require('./src/routes/app');

const server = http.createServer(application);
server.listen(PORT);

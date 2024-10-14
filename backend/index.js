const http = require('http');
const app = require('./server');

const server = http.createServer(app);

const PORT = 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const http = require('http');
require('dotenv').config();

const connection = require('./config/database');
const app = require('./server');

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;


(async function () {
    try {
        await connection();
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.log(err);
    }
})();
if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const mongoose = require('mongoose');


async function connection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database connected');
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = connection;
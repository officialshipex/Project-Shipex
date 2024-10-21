const mongoose = require('mongoose');
const config = require('../config');
console.log(config.DB.MONGO_URL);

//Connection of MongoDb Database
const connect = () => {
    mongoose.connect(config.DB.MONGO_URL)
    .then(() => console.log('MongoDb Connected..'))
    .catch(err => console.log('Mongo Error',err));
} 

module.exports = connect

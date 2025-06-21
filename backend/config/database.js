const mongoose = require('mongoose');

async function connection() {
    try {
        console.log("🌍 MONGODB_URI from env (database.js):", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,  // Wait 10s for DB server
            socketTimeoutMS: 60000,           // Wait 60s for query response
            maxPoolSize: 10,                  // Connection pool size
            connectTimeoutMS: 10000,          // Wait 10s for initial connection
        });

        console.log('✅ Database connected successfully');
    } catch (err) {
        console.error('❌ Database connection error:', err);
        process.exit(1);  // Exit process if DB fails to connect
    }
}

// Retry logic for MongoDB connection
const connectWithRetry = () => {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
    }).then(() => {
        console.log('✅ Database connected successfully');
    }).catch(err => {
        console.error('❌ Database connection error:', err);
        setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    });
};

connectWithRetry();  // Initial call to connect

module.exports = connection;

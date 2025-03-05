if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');

async function connection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,  // Wait 5s for DB server
            socketTimeoutMS: 45000,          // Wait 45s for query response
            maxPoolSize: 10,                 // Increase connection pool size
        });

        console.log('✅ Database connected successfully');
    } catch (err) {
        console.error('❌ Database connection error:', err);
        process.exit(1);  // Exit process if DB fails to connect
    }
}

module.exports = connection;

const mongoose = require("mongoose");

const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 60000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
      });

      console.log("✅ Database connected successfully");
      return; // Exit loop on success
    } catch (err) {
      console.error(
        `❌ Attempt ${attempt} - MongoDB connection failed:`,
        err.message
      );
      if (attempt < retries) {
        console.log(`🔁 Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error("❌ All retry attempts failed. Exiting...");
        process.exit(1);
      }
    }
  }
};

module.exports = connectWithRetry;

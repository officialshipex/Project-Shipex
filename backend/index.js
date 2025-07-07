require("dotenv").config();
const connection = require("./config/database");
const {startTrackingLoop}=require("./Orders/tracking.controller")


const PORT = process.env.PORT || 5000;

(async function () {
  console.log("server is there")
  try {
    console.log("connection started")
    await connection();
    const app = require("./server");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on http://65.1.105.160:${PORT}`);
    });
    startTrackingLoop()
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
})();

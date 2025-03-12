const passport = require("passport");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const session = require("express-session");
const MongoStore = require("connect-mongo");

// Importing Routes
const router = require("./routes"); // Ensure this file exists and correctly registers /v1/external/login
const ShipRocketController = require("./AllCouriersRoutes/shiprocket.router");
const ShreeMarutiController = require("./AllCouriersRoutes/shreemaruti.router");
const nimbuspostRoutes = require("./AllCouriersRoutes/nimbuspost.router");
const delhiveryRouter = require("./AllCouriersRoutes/delhivery.router");
const compression = require("compression");

const otpRouter = require("./auth/auth.otp");
const emailOtpRouter = require("./notification/emailOtpVerification");

const app = express();

// 🛠 Apply Middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(helmet());
app.use(cors()); // ✅ Only call once
app.use(compression());

// 🛠 Setup Session
const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  crypto: {
    secret: process.env.MONGO_SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error", (err) => {
  console.log("ERROR IN MONGO STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.MONGO_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionOptions));
app.use(passport.initialize());

// ✅ Correct API Route Order
app.use("/v1", router); // 👈 Register main routes first
// ✅ Use `express.raw()` Only for Webhook
app.use(
  "/v1/channel/webhook-handler",
  express.raw({ type: "application/json" })
);
app.use("/v1/Shiprocket", ShipRocketController);
app.use("/v1/shreeMaruti", ShreeMarutiController);
app.use("/v1/delhivery", delhiveryRouter);
app.use("/v1/nimbuspost", nimbuspostRoutes);
app.use("/v1/auth", otpRouter);
app.use("/v1/auth", emailOtpRouter);

// ✅ Serve Static Files AFTER API Routes
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;

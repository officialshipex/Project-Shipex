require("dotenv").config();
const express = require("express");
const connection = require("./config/database");

const app = express();

const PORT = process.env.PORT || 5000;

(async function () {
  try {
    await connection(); // ✅ Wait for DB to connect

    // ✅ Only now load and use routes/middleware
    const passport = require("passport");
    const helmet = require("helmet");
    const cors = require("cors");
    const path = require("path");
    const session = require("express-session");
    const MongoStore = require("connect-mongo");
    const compression = require("compression");

    const router = require("./routes");
    const ShipRocketController = require("./AllCouriersRoutes/shiprocket.router");
    const ShreeMarutiController = require("./AllCouriersRoutes/shreemaruti.router");
    const nimbuspostRoutes = require("./AllCouriersRoutes/nimbuspost.router");
    const delhiveryRouter = require("./AllCouriersRoutes/delhivery.router");
    const otpRouter = require("./auth/auth.otp");
    const emailOtpRouter = require("./notification/emailOtpVerification");

    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ limit: "10mb", extended: true }));
    app.use(helmet());
    app.use(cors());
    app.use(compression());

    // ✅ MongoStore AFTER DB is connected
    const store = MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      crypto: { secret: process.env.MONGO_SECRET },
      touchAfter: 24 * 3600,
    });

    app.use(
      session({
        store,
        secret: process.env.MONGO_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        },
      })
    );

    app.use(passport.initialize());

    // ✅ Routes
    app.use("/v1", router);
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

    // ✅ Static files
    app.use(express.static(path.join(__dirname, "public")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "public", "index.html"));
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on http://65.1.105.160:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error while starting server:", err);
    process.exit(1);
  }
})();

const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const isAuthorized = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      success: false,
      message: "You must be logged in",
    });
  }


  const [Bearer, token] = authorization.split(" ");



  if (Bearer !== "Bearer" || !token) {
  
    return res.status(401).json({
      success: false,
      message: "You must be logged in",
    });
  }
  // console.log(token)

  const { user } = jwt.verify(token, process.env.JWT_SECRET);
  // console.log(user)

  // console.log("User : ", user);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "You must be logged in",
    });
  }

  const userExists = await User.findOne({ _id: user.id });

  // console.log("User Exists : ", userExists);

  if (!userExists) {
    return res.status(401).json({
      success: false,
      message: "You must be logged in",
    });
  }

  req.user = userExists;

  next();
};

module.exports = {isAuthorized};


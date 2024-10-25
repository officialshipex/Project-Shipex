// const { generateToken } = require("../utils/jwtToken");
// const responseMessage = require("../helpers/responseMessage");
const { validateForm, validateEmail } = require("../utils/afv");
// const userService = require("../services/users");
// const response = require("../helpers/response");
const User = require("../model/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//for User Registration
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, company, monthlyOrders, password, confirmedPassword, checked } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !company || !monthlyOrders || !password || !confirmedPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const userData = { firstName, lastName, email, phoneNumber, company, monthlyOrders: Number(monthlyOrders), password, confirmedPassword, checked }

    const validateFields = validateForm(userData);

    if (validateFields && Object.keys(validateFields).length > 0) {
      return res.status(400).json({
        success: false,
        message: validateFields,
      });
    }

    const userEmail = await User.findOne({ email });
    const userPhoneNumber = await User.findOne({ phoneNumber });
    const userCompany = await User.findOne({ company });

    if (userEmail) {
      return res.status(400).json({
        success: false,
        message: "Email or User already exists",
      });
    }

    if (userPhoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone Number already exists",
      });
    }

    if (userCompany) {
      return res.status(400).json({
        success: false,
        message: "Company already exists",
      });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      company,
      monthlyOrders,
      password: hashedPassword,
    });

    await newUser.save();

    const payload = {
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: token,
    })

  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
};


//For User Login 
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      })
    }

    const validateFields = validateEmail(email);

    if (!validateFields) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      })
    }

    const user = await User.findOne({ email });
    console.log("user", user);

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect",
      })
    }

    const payload = {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
      },
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });


    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: token,
    });

  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
};


//For successfull Google login  
const googleLogin = async (req, res) => {
  try {
    const profile = req.user;
    console.log("profile", profile);
    const userExist = await User.findOne({ email: profile.email });
    if (!userExist) {
      const newUser = new User({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.email,
        phoneNumber: profile.phone || "",
        company: profile.company || "",
        monthlyOrders: profile.monthlyOrders || 0,
        googleOAuthID: profile.id,
        isVerified: profile.email_verified,
        provider: 'Google',
      });

      await newUser.save();
    }

    const user = await User.findOne({ email: profile.email });
    const payload = {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
      },
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    // res.redirect("http://localhost:5173");
    
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: token,
    })

    

  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  };
}

//for failure google login 
const googleLoginFail = (req, res) => {
  try {
    return res.status(400).json({
      success: false,
      message: "Google login failed",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  register,
  login,
  googleLogin,
  googleLoginFail,
};

// module.exports = { register, login };
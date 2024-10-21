const userService = require("../services/users");
const response = require("../helpers/response");
const responseMessage = require("../helpers/responseMessage");
const users = require("../model/users");
const { generateToken } = require("../utils/jwtToken");

//for User Registration
const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      countryCode,
      phoneNumber,
      company,
      monthlyOrders,
      isBuyer,
      isSeller,
    } = req.body;
    const params = {
      firstName,
      lastName,
      email,
      countryCode,
      phoneNumber,
      company,
      monthlyOrders,
      password: await users.hashPassword(req.body.password),
      isBuyer,
      isSeller,
    };

    const userCreated = await userService.createUser(params);
    console.log("userCreated", userCreated);

    if (!userCreated) {
      return response.badRequestError(
        res,
        responseMessage.USER.CREATATION_FAILED
      );
    }

    const payload = {
      user: {
        id: userCreated._id,
        email: userCreated.email,
        firstName: userCreated.firstName,
      },
    };

    const token = generateToken(payload);

    if (!token) {
      return response.serverError(res, error);
    }

    return response.success(res, responseMessage.USER.CREATED_SUCCESS, token);

  } catch (error) {
    console.log("error", error);
    return response.serverError(res, error);
  }
};

//For User Login 
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExites = await userService.findUser(email);
    console.log("userExist", userExites);

    if (!userExites) {
      return response.badRequestError(res, responseMessage.USER.NOT_FOUND);
    }

    const decryptedPass = await users.validatePassword(
      password,
      userExites.password
    );

    if (!decryptedPass) {
      return response.badRequestError(
        res.responseMessage.USER.PASSWORD_NOT_MATCH
      );
    }

    const payload = {
      user: {
        id: userExites._id,
        email: userExites.email,
        firstName: userExites.firstName,
      },
    };

    const token = generateToken(payload);
    
    if (!token) {
      return response.serverError(res, error);
    }
    
    return response.success(res, responseMessage.USER.LOGIN_SUCCESS, token);

  } catch (error) {
    console.log("error", error);
    return response.serverError(res, error);
  }
};

//For check/testing of Google login api in backend
const loadAuth = (req, res) => {
  console.log("hello");
  res.render("auth");
};

//For successfull Google login  
const successGoogleLogin = async (req, res) => {
  try {
    if (!req.user) {
      res.redirect("/failure");
    }
    const params = {
      firstName: req.user.given_name,
      lastName: req.user.family_name,
      email: req.user.email,
      countryCode: "",
      phoneNumber: "",
      company: "",
      monthlyOrders: 0,
      password: "",
      isBuyer: req.query.isBuyer,
      isSeller: req.query.isSeller,
      googleOAuthID: req.user.id,
      oAuthType: 1, //1=Google
      isVerified: req.user.verified,
    };

    const userExist = await userService.findGoogleUser(
      params.email,
      params.googleOAuthID
    );
    console.log("userExist..", userExist);
    if (userExist) {
      const payload = {
        user: {
          id: userExist._id,
          email: userExist.email,
          firstName: userExist.firstName,
        },
      };
      const token = generateToken(payload);
      if (!token) {
        return response.serverError(res, error);
      }
      return response.success(res, responseMessage.USER.LOGIN_SUCCESS);
    }

    const userCreated = await userService.createUser(params);
    console.log("userCreated", userCreated);

    if (!userCreated) {
      return response.badRequestError(
        res,
        responseMessage.USER.CREATATION_FAILED
      );
    }

    console.log(req.user);
    res.send("Welcome'" + req.user.email);

    const payload = {
      user: {
        id: userCreated._id,
        email: userCreated.email,
        firstName: userCreated.firstName,
      },
    };
    const token = generateToken(payload);
    if (!token) {
      return response.serverError(res, error);
    }
    return response.success(res, responseMessage.USER.LOGIN_SUCCESS, token);
  } catch (error) {
    console.log("error", error);
    return response.serverError(res, error);
  }
};

//for failure google login 
const failureGoogleLogin = (req, res) => {
  res.send("Error");
};

module.exports = {
  register,
  login,
  successGoogleLogin,
  failureGoogleLogin,
  loadAuth,
};

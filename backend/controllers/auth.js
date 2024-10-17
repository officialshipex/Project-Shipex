const userService = require("../services/users");
const response = require("../helpers/response");
const responseMessage = require("../helpers/responseMessage");
const users = require("../model/users");
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
    console.log("params", params, req.body);

    const userCreated = await userService.createUser(params);
    console.log("userCreated", userCreated);

    if (!userCreated) {
      return response.badRequestError(
        res,
        responseMessage.USER.CREATATION_FAILED
      );
    }
    return response.success(
      res,
      responseMessage.USER.CREATED_SUCCESS,
      userCreated
    );
  } catch (error) {
    console.log("error", error);
    return response.serverError(res, error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExites = await userService.findUser(email);
    // const data = await usersSchema.({email,password});
    console.log("userExist", userExites);
    if (!userExites) {
      return response.badRequestError(res, responseMessage.USER.NOT_FOUND);
    }
    const decryptedPass = await users.validatePassword(
      password,
      userExites[0].password
    );
    if (!decryptedPass) {
      return response.badRequestError(
        res.responseMessage.USER.PASSWORD_NOT_MATCH
      );
    }
    return response.success(res, responseMessage.USER.LOGIN_SUCCESS);
  } catch (error) {
    console.log("error", error);
    return response.serverError(res, error);
  }
};

const loadAuth = (req,res) => {
  console.log("hello")
   res.render('auth');
  // res.send("hhhkkjkji")
}

const successGoogleLogin = (req,res) =>  {
  if(!req.user){
    res.redirect('/failure');
  }
  console.log(req.user);
  res.send("Welcome" + req.user.email);
}

const failureGoogleLogin = (req,res) => {
  res,send("Error");
}

module.exports = {
  register,
  login,
  successGoogleLogin,
  failureGoogleLogin,
  loadAuth
};

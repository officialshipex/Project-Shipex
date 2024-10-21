const express=require('express')
const router=express()
const {register, login, successGoogleLogin,failureGoogleLogin,loadAuth}=require('../controllers/auth')
const passport = require('passport');
const {isAuthorized} = require('../middleware/auth');

//Registration route
router.post('/register',register)

//Login route
router.post('/login',login)

//test route for Google in backend
router.get('/',loadAuth)

//Auth
router.get('/google',passport.authenticate('google',{scope :
    ['email','profile']
}));

//Auth Callback
router.get('/google/callback',
    passport.authenticate('google',{
        successRedirect:`/auth/success?isBuyer=${0}&isSeller=${1}`,
        failureRedirect:'/auth/failure'
    })
);

//success
router.get('/success',successGoogleLogin);

//failure
router.get('/failure',failureGoogleLogin);

module.exports=router
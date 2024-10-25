const { register, login, googleLogin, googleLoginFail } = require('../controllers/auth.controller')
const { isAuthorized } = require('../middleware/auth');
// const passport = require('passport');
const authRouter = require('express').Router();
const passport = require('../config/passwordConfig');

authRouter.post('/register', register);

authRouter.post('/login', login)


// //test route for Google in backend
// authRouter.get('/', loadAuth)

//Auth
authRouter.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile'],
    }));

//Auth Callback
authRouter.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/failure', session: false }),
    googleLogin,
);

authRouter.get('/failure', googleLoginFail);


module.exports = authRouter
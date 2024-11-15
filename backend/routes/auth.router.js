const { register, login, googleLogin, googleLoginFail, verifySession } = require('../auth/auth.controller')
const { isAuthorized } = require('../middleware/auth.middleware');
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

authRouter.get('/verify', verifySession);


module.exports = authRouter
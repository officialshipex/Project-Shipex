const authRouter = require('express').Router();
const auth = require('../auth/auth.controller');


authRouter.use('/auth', auth);

module.exports = authRouter;
const response = require('../helpers/response');
const {JWT} = require('../helpers/responseMessage');
const { validateToken } = require('../utils/jwtToken');


const isAuthorized = (req,res,next) => {
    const { headers } = req;
    const authHeader = headers.authorization;;

    if(!authHeader) return response.authorizationError(res,JWT.INVALID_AUTHORIZATION);

    if(!authHeader.startsWith('Bearer ')) {
        return response.authorizationError(res,JWT.INVALID_AUTHORIZATION);
    }

    const token = authHeader.split(' ')[1];

    if(!token){
        return response.authorizationError(res,JWT.INVALID_TOKEN);
    }

    const jwtTokenData = validateToken(token);
    const {success,data} = jwtTokenData;

    if(!success){
        return response.authorizationError(res,JWT.INVALID_TOKEN);
    }

    req.user = data;
    next()

 }

 module.exports = {
    isAuthorized
 }
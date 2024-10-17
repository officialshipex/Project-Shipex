const Dotenv = require('dotenv');
Dotenv.config();

const config={
    PORT:process.env.PORT || 3000,
    DB:{
    MONGO_URL:process.env.MONGO_URL  || 'mongodb://127.0.0.1:27017/shipex_be',
    
    },
    HTTP_STATUS_CODES: {
		OK: 200,
		CREATED: 201,
		ACCEPTED: 202,
		NO_CONTENT: 204,
		BAD_REQUEST: 400,
		UNAUTHORIZED: 401,
		FORBIDDEN: 403,
		NOT_FOUND: 404,
		UNPROCESSABLE_ENTITY: 422,
		TOO_MANY_REQUESTS: 429,
		INTERNAL_SERVER_ERROR: 500,
		BAD_GATEWAY: 502,
		SERVICE_UNAVAILABLE: 503
	}
}
module.exports=config
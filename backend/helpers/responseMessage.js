module.exports = {
	errorMessages: {
		BAD_REQUEST: 'Bad request.',
		UNAUTHORISED: 'Unauthorised access. Please login to your account.',
		FORBIDDEN: 'You are not authorised to make this request.',
		NOT_FOUND: 'Endpoint not found.',
		RESOURCE_NOT_FOUND: 'Resource not found.',
		SERVER_ERROR: 'Something went wrong, please try again later.',
		UNAUTHORISED_ACCESS: 'You are not Authorised to access this resource. '
	},
	USER: {
		NOT_FOUND: 'No user found',
		CREATED_SUCCESS: 'User Created Successfully.',
        CREATATION_FAILED: 'Error in User Creatation',
		FETCH_SUCCESS: 'Users Fetch Successfully.',
		DETAILS_SUCCESS: 'User details fetch successfully',
		INVALID_EMAIL: 'User with this email does not exist',
		EMAIL_EXISTS: 'User is already registered with this email address.',
		INVALID_PASSWORD: 'Invalid Password.',
		LOGIN_SUCCESS: 'Login successful.',
		VERIFIED: 'Verified Successfully',
		NOT_VERIFIED: 'User not verified',
		DEACTIVATED: 'Your account is deactivated',
		INVALID_AUTH: 'Please use email sign in option to login',
		INVALID_AUTH_1: 'Your account is associated with Google.Please use Google sign In',
		PASSWORD_NOT_MATCH: 'Password and Confirm password is not matched',
		MOBILE_NOT_FOUND: 'User not found with this mobile number',
		ALREADY_VERIFIED: 'User is already verified',
		TOKEN_VERIFY: 'Token verification successfully',
		LOGGED_OUT: 'User logged out successfully'
		
	},
	
	JWT: {
		INVALID_AUTHORIZATION: 'Invalid authorization',
		INVALID_TOKEN: 'Invalid token',
		UNAUTHORIZED: 'Your account has been disabled by Admin'
	},
	
};
module.exports = {
	environment: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 8080,
	jwtConfig: {
		secret: process.env.JWT_SECRET,
		expiresIn: process.env.JWT_EXPIRES_IN,
	},
	awsConfig: {
		accessKey: process.env.AWS_ACCESS_KEY_ID,
		secret: process.env.AWS_SECRET,
		region: process.env.AWS_REGION,
	},
};
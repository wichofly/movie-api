const passport = require('passport'),
	localStrategy = require('passport-local').Strategy,
	Models = require('./model.js'),
	passportJWT = require('passport-jwt');

let Users = Models.User,
	JWTStrategy = passportJWT.Strategy,
	ExtractJWT = passportJWT.ExtractJwt;

// Defines baisc HTTP authentication for login request
passport.use(new localStrategy({
	usernameField: 'username',
	passwordField: 'password'
}, (username, password, callback) => {
	console.log(username + ' ' + password);
	Users.findOne({ username: username }, (error, user) => {
		if (error) {
			console.log(error);
			return callback(error);
		}

		if (!user) {
			console.log('Incorrect username');
			return callback(null, false, { message: 'Incorrect username or password' });
		}

		if (!user.validatePassword(password)) {
			console.log('incorrect password');
			return callback(null, false, { message: 'Incorrect password.' });
		}

		console.log('Finished');
		return callback(null, user);
	});
}));

// Allows to authenticate users based on the JWT submitted alongside their request.
passport.use(new JWTStrategy({
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
	return Users.findById(jwtPayload._id)
		.then((user) => {
			return callback(null, user);
		})
		.catch((error) => {
			return callback(error)
		});
}));
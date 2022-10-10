const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport');

/**
 * Creates JWT that expires in 7 days. It uses algorithm to “sign” or encode the values of the JWT
 * @param {object} user 
 * @returns user object, jwt, and additional information on token
 */

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username, // This is the username i am encoding in the JWT
    expiresIn: '7d',
    algorithm: 'HS256' // This is the algorithm used 
  });
}

// POST login
/**
 * Handles user login, generating a jwt upon login
 * @function generateJWTToken
 * @param {*} router 
 * @return user object with jwt
 * @requires passport
 */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something went wrong',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  // grabbing or importing jwt cookie token in authControllers
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message)
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  }
  else {
    res.redirect('/login');
  }
}

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt
  // check if the token actually exist
  if(token){
    jwt.verify(token, 'net ninja secret',  async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        // set locals = null b/c we are going to check for our values inside the views later if the user does not exist it will throw an error 
        res.locals.user = null;
        next();
      } else {  
        // if there's no error there's a user, a valid user that's logged in
        // what we are going to do is to get the user information so that we can inject it into views in the future 
        // the *decodedToken* has an id which we created in our createToken that is in authController and that is the id of the user which we have now as a *decodedToken*
        console.log(decodedToken);
        // what we now do is to find that user in the db using User.findById to find the id of the user we are looking for which is in the decodedToken.id
        let user = await User.findById(decodedToken.id);
        //now we have the User we want to inject the user into our views by using *locals* in other to get the properties
        res.locals.user = user;
        next();
      }
    });
  }
  else{
    // if the user does not exist
    res.locals.user = null;
    next();
  }
}

module.exports = { requireAuth, checkUser };
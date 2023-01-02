const mongoose = require('mongoose');
const {isEmail } = require('validator')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email:{
    type:String,
    required:[true, 'Please enter your email'],
    unique:true,
    lowercase:true,
    validate:[isEmail, 'Please enter a valid email']
  },
  password:{
    type:String,
    required:[true, 'please enter your password'],
    minlength:[6, 'Minimum password length is 6 characters']
  },
});

// fire a function before doc is saved to db by using the *this* keyword
userSchema.pre('save',async function(next){
  // first generate a salt
  const salt = await bcrypt.genSalt();
  // here we attach a salt to the password before it is hashed and stored in the database
  // the hash takes in two argument the password you want to hash and salt
  // the *this* keyword is used to have access to the instance of the user that want to create account/signup on our website
  // the this.password will no longer be a plain password rather a hashed password
  this.password = await bcrypt.hash(this.password, salt);

  // for pre Hook i.e Middleware hooks
  console.log('user about to be created', this);
  next();
});

// fire a function after a new user or doc has been saved to db
userSchema.post('save', function(doc,next){
  console.log('new user was created & saved', doc);
  next();
});

// static method to user model
userSchema.statics.login = async function(email, password){
  // finding the email in the db
  const user = await this.findOne({email});
  if (user) {
    // compare the hashed password in the db
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email')
}

const User = mongoose.model('user', userSchema)

module.exports = User;
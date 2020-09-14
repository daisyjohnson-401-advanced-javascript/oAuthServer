'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = new mongoose.Schema({
  username:{ type: String, required: true, unique: true},
  password:{ type: String, required: true},
  email:{ type: String },
  role:{ type: String, required:true, default: 'user', enum: ['admin', 'editor', 'user']},
});


// *****************
users.pre('save', async function() {
  if(this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// create user from email OAuth
users.statics.createFromOauth = async function(username) {
  if(!username){
    return Promise.reject('Validation Error');
  }
  return this.findOne({ username })
    .then(user => {
      if (!user) { throw new Error('User Not Found :('); }
      console.log('Welcome Back', user.username);
      return user;
    })
    .catch(error => {
      console.log('Creating new user');
      let password = 'randomPassword';
      
      return this.create({ username, password});
      
    });
  // })
  // let query = { username };
  // const user = await this.findOne(query);

  // if(user){
  //   return user;
  // } else {
  //   return this.create({ username: username, password: 'none', email: username});
  // }
};
// Authenticate Basic Method
users.statics.authenticateBasic = async function (username, password) {
  const user = await this.findOne({ username });

  return user && user.comparePassword(password);
};

//Check Password
users.methods.comparePassword = async function(plainPassword) {
  const passwordMatch = await bcrypt.compare(plainPassword, this.password);
  return passwordMatch ? this : null;
};

//Generate a token
users.methods.generateToken = function(){
  console.log('IN GENERATE TOKEN');
  let tokenData = {
    id: this._id,
    username: this.username,
    role: this.role,
  };
  let options = {};
  console.log('MAKE IT THROUGH GENERATE TOKEN');
  const signed = jwt.sign(tokenData, process.env.SECRET, options);
  return signed;
};

//LAB 13 AUTHENTICATE TOKEN
users.statics.authenticateToken = function (token) {

  let parsedToken = jwt.verify(token, process.env.SECRET);

  return this.findById(parsedToken.id);
};

module.exports = mongoose.model('users', users);
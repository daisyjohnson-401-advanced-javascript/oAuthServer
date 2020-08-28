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
  let tokenData = {
    id: this._id,
    username: this.username,
    role: this.role,
  };
  let options = {};

  const signed = jwt.sign(tokenData, process.env.SECRET, options);
  return signed;
};

//LAB 13 AUTHENTICATE TOKEN
users.statics.authenticateToken = function (token) {

  let parsedToken = jwt.verify(token, process.env.SECRET);

  return this.findById(parsedToken.id);
};


// create user from email OAuth
users.statics.createFromOauth = async function(email) {
  if(!email){
    return Promise.reject('Validation Error');
  }
  let query = { email };
  const user = await this.findOne(query);

  if(user){
    return user;
  } else {
    return this.create({ username: email, password: 'none', email: email});
  }
};

module.exports = mongoose.model('users', users);
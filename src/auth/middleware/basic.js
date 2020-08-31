'use strict';

const base64 = require('base-64');
const User = require('../models/user-model.js');

module.exports = async (req, res, next) => {

  const errorObj = { status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password' };

  console.log('HEADER AUTHHHHH', req.headers.authorization);
  //Pull out just the encoded part by splitting the header into an array
  let encodedPair = req.headers.authorization.split(' ').pop();

  //decodes to user:pass and splits into an array
  // const decoded = base64.decode(encodedPair).split(' ');

  let [user, pass] = base64.decode(encodedPair).split(':');

  // is this user ok?
  try {
    const validUser = await User.authenticateBasic(user, pass);

    req.token = validUser.generateToken();
    next();
  } catch (err) {
    next(errorObj);
  }


};
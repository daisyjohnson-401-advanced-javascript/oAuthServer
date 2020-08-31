'use strict';

const superagent = require('superagent');
const users = require('../models/user-model.js');
require('dotenv').config();

const tokenServerUrl = 'https://github.com/login/oauth/access_token';
const remoteAPI = 'http://api.github.com/user';
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const API_SERVER = 'http://localhost:3000/oauth';

//OAUTH FUNCTION
module.exports = async function authorize(req, res, next) {
  console.log('INSIDE OAUTH FUNCTION');
  try{
    let code = req.query.code;
    console.log('---------CODE', code);

    // Exchange the code received on the initial request for a token from the provider
    let remoteToken = await exchangeCodeForToken(code);
    console.log('-----------TOKEN', remoteToken);

    // Use the token to retrieve the user's account information from the Provider
    let remoteUser = await getRemoteUserInfo(remoteToken);
    console.log('----------REMOTE USER', remoteUser);

    // Create/Retrieve an account from our Mongo users database matching ther user's account (email or username) using the users model 
    let [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;
    console.log('------LOCAL USER', user);
    console.log('------LOCAL TOKEN', token);

    next();
  }catch (err) { next( 'ERROR in OAUTH METHOD Unauthorized ' );
  }
};

// Exchange the code received on the initial request for a token from the provider
async function exchangeCodeForToken(code){
  let tokenResponse = await superagent.post(tokenServerUrl).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_url: API_SERVER,
    grant_type:'authorization_code',
  });
  let access_token = tokenResponse.body.access_token;

  return access_token;
}

// Use the token to retrieve the user's account information from the Provider
async function getRemoteUserInfo(token) {
  let userResponse =
    await superagent.get(remoteAPI)
      .set('user-agent', 'express-app')
      .set('Authorization', `token ${token}`);
  
  let user = userResponse.body;

  return user;
}


// Create/Retrieve an account from our Mongo users database matching ther user's account (email or username) using the users model 
async function getUser(remoteUser) {
  let userRecord = {
    username: remoteUser.login,
    password: 'oauthpassword',
    email: remoteUser.email,
    name: remoteUser.name,
  };

  console.log('INSIDE GET USER');
  let user = await users.createFromOauth(userRecord);
  
  // Generate a token using the users model
  let token = user.generateToken();

  // Add the token and the user record to the request object
  return [user, token];
}



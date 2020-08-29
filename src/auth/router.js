'use strict';

const express = require('express');
const router = express.Router();

const User = require('../auth/models/user-model.js');
const basicAuth = require('./middleware/basic.js');
const oauthMiddleWare = require('./middleware/oauth.js');

router.post('/signup', async (req, res, next) => {
  console.log('IN SIGNUPPPP');
  const user = await User.create(req.body);
  const token = user.generateToken();

  const resultBody = {
    token,
    user,
  };
  
  res.status(200).send(resultBody);
});

// POST METHOD FOR SIGNIN
router.post('/signin', basicAuth, (req, res) => {
  console.log('IN THE SIGNINNNN');
  // cookie>
  res.cookie('auth', req.token);
  res.set('token', req.token);
  // send JSON object as response with tokens ans users db results
  res.status(200).send({
    token: req.token,
    user: req.user,
  });
  
});

// GET ROUTE FOR /users. RETURNS A JSON OBJECT WITH ALL USERS
// router.get('/users', (req, res) => {
//   res.status.send(req.token);

// });

router.get('/oauth', oauthMiddleWare, (req, res) => {
  res.status(200).send(req.token);
});

module.exports = router;
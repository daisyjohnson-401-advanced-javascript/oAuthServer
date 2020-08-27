'use strict';

const express = require('express');
const router = express.Router();

const User = require('../auth/models/user-model.js');
const basicAuth = require('./middleware/basic.js');
const oauthMiddleWare = require('./middleware/oauth.js');

router.post('/signup', async (req, res, next) => {
  const user = new User(req.body);

  // SAVE THE USER
  user.save()
    .then(user => {
      // RESPONDS WITH A SPECIAL TOKEN SO USER CAN SIGN IN AGAIN
      req.token = user.generateToken(user);
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.status(200).send(req.token);
      next();
    })
    .catch( e => {
      console.error(e);
      res.status(403).send('Whoopsie Daisy! There was an error creating user!');
    });
});

router.post('/signin', basicAuth, (req, res, next) => {
  res.send({
    token: req.token,
    user: req.user,
  });
  res.cookie('auth', req.token);
  next();
});

// router.get('/oauth', oauthMiddleWare, (req, res, next) => {
//   res.status(200).send(req.token);
// });

module.exports = router;
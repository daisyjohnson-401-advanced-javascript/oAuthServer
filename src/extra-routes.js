'use strict';

const express = require('express');
const bearerAuthMiddleware = require('../src/auth/middleware/bearer.js');
const router = express.Router();

// router.get('/secret', bearerAuthMiddleware, (req,res) => {
//   res.status(200).send('access allowed');
// });

//anyone can get in
//doesn't need a token
router.get('/public', routeHandler);

router.get('/private', bearerAuthMiddleware, routeHandler);

// router.get('/read', bearerAuthMiddleware, permissions('read'),routeHandler);

// router.get('/create', bearerAuthMiddleware, permissions('create'), routeHandler);

// router.get('/update', bearerAuthMiddleware, permissions('update'), routeHandler);

// router.get('/delete', bearerAuthMiddleware, permissions('delete'), routeHandler);

function routeHandler(req,res){
  res.status(200).send('Access Granted');
}

module.exports = router;
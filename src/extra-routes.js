'use strict';

const express = require('express');
const bearerAuthMiddleware = require('../src/auth/middleware/bearer.js');
const router = express.Router();

// router.get('/secret', bearerAuthMiddleware, (req,res) => {
//   res.status(200).send('access allowed');
// });

router.get('/read', bearerAuthMiddleware, permissions('read'), () => {

});

router.get('/add', bearerAuthMiddleware, permissions('create'), () => {
  
});

router.get('/change', bearerAuthMiddleware, permissions('update'), () => {
  
});

router.get('/remove', bearerAuthMiddleware, permissions('delete'), () => {
  
});


module.exports = router;
'use strict';

const express = require('express');
const bearerAuthMiddleware = require('../src/auth/middleware/bearer.js');
const router = express.Router();

router.get('/secret', bearerAuthMiddleware, (req,res) => {
  res.status(200).send('access allowed');
});

module.exports = router;
'use strict';

require('dotenv').config();

// DB server

const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
};
mongoose.connect(process.env.MONGODB_URI, options);

// START SERVER
require('./src/server.js').start(process.env.PORT);
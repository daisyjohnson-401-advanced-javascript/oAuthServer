'use strict';

require('dotenv').config();

// DB server

const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose.connect('mongodb://localhost:27017/oauth', options);

// START SERVER
require('./server.js').start(process.env.PORT);
'use strict';


const mongoose = require('mongoose');
require('dotenv').config();
// DB server


const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.MONGODB_URI, options);

// START SERVER
require('./server.js').start(process.env.PORT);
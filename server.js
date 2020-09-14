'use strict';

'use strict';

// Third Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric resources
const errorHandler = require('./src/middleware/500.js');
const notFound = require('./src/middleware/404.js');
const authRouter = require('./src/auth/router.js');

// Prepare express app
const app = express();

// APP Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(authRouter);

// Catch alls
// 404 error
app.use('*', notFound);

//500 Errors
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Listening on ${port}`);
    });
  },
};
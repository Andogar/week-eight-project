const express = require('express');
const application = require('./application.js');

application.listen(process.env.PORT || 3000 );
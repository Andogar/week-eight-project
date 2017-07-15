const express = require('express');
const application = require('./application.js');

application.listen(process.env.PORT, '0.0.0.0', function(error) {
  console.log("Started listening on %s", application.url);
});
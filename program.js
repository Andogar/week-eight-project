const express = require('express');
const application = require('./application.js');

application.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, application.settings.env);
});
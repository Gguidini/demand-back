const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const log = require('loglevel');
const app = express();

// Constants & Defaults
const PORT = 8000;
log.setDefaultLevel(log.levels.DEBUG);

// Debug middleware
app.use( (req, res, next) => {
  log.debug(`[${moment().format("DD/MM/YYYY hh:mm:ss")}] ${req.method} ${req.url}`);
  next();
});
// Default middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// API Version routers
const routerVersion1 = require('./routerVersion1');
const routerVersion2 = require('./routerVersion2');
// you can nest routers by attaching them as middleware:
app.use('/v1', routerVersion1);
app.use('/v2', routerVersion2);
app.get('/', (req, res) => {
  res.send("Versions available:\nv1, v2");
});

app.listen(PORT, (err) => {
  if(err) {
    log.error(err.message());
  } else {
    log.info('Example app listening on port', PORT);
  }
});




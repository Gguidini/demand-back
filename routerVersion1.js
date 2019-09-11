const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const log = require('loglevel');

log.setDefaultLevel(log.levels.DEBUG);

const routerVersion1 = express.Router({mergeParams: true});

// Default middleware
routerVersion1.use(bodyParser.urlencoded({ extended: true }));
routerVersion1.use(bodyParser.json());

routerVersion1.get('/', (req, res) => {
  res.send("Hello from router v1 👋"); 
})
routerVersion1.get('/all', (req, res) => {
  const data = require('./mock.json');
  res.json(data);
})

routerVersion1.get('/filter', (req, res) => {
  const filters = JSON.parse(req.query.filter);
  const data = require('./mock.json');

  log.debug("Filters:", filters);
  if(Object.keys(filters).length === 0) {
    log.debug("Filters were empty. Returning everything");
    res.json(data);
  } else {
    const keys = Object.keys(filters)
    const transactionsFiltered = data.transactions.filter( (item) => {
      for(let i = 0; i < keys.length; i++){
        // Filter is null
        if(filters[keys[i]] == '') continue;
        if(keys[i] === "date"){
          // Dates are treated differently
          const filterFwd = moment(filters[keys[i]]).add(1, 'month');
          const filterBkd = moment(filters[keys[i]]).subtract(1, 'month');
          const itemDate = moment(item[keys[i]]);
          // Check if item date is within a month of date in filter
          if(! itemDate.isBetween(filterBkd, filterFwd)) return false;
        } else {
          // Normal text input
          if(!item[keys[i]].toLowerCase().startsWith(filters[keys[i]].toLowerCase())){
            return false;
          }
        }
      }
      return true;
    });
    console.debug(`Returning ${transactionsFiltered.length} transactions`);
    res.json({"size": transactionsFiltered.length, "transactions": transactionsFiltered});
  }
});

module.exports = routerVersion1;
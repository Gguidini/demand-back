const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const log = require('loglevel');

log.setDefaultLevel(log.levels.INFO);

const routerVersion2 = express.Router({mergeParams: true});

// Default middleware
routerVersion2.use(bodyParser.urlencoded({ extended: true }));
routerVersion2.use(bodyParser.json());

routerVersion2.get('/', (req, res) => {
  res.send("Hello from router v2 👌"); 
});

routerVersion2.get('/all', (req, res) => {
  const left = parseInt(req.query.left) || 0;
  const pageSize = parseInt(req.query.pageSize) || 25;
  const data = require('./mock.json');
  log.debug(`Left: ${left}. pageSize: ${pageSize}`);
  res.json({transactions:data.transactions.slice(left * pageSize, left * pageSize + pageSize), size:data.size});
})

routerVersion2.get('/filter', (req, res) => {
  const filters = JSON.parse(req.query.filter);
  const left = parseInt(req.query.left) || 0;
  const pageSize = parseInt(req.query.pageSize) || 25;
  const data = require('./mock.json');

  log.debug("Filters:", filters);
  log.debug(`Left: ${left}. pageSize: ${pageSize}`);

  if(Object.keys(filters).length === 0) {
    log.debug("Filters were empty. Returning everything");
    res.json({
      transactions:data.transactions.slice(left * pageSize, left * pageSize + pageSize),
      size:data.size
    });
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
    res.json({
      "size": transactionsFiltered.length,
      "transactions": transactionsFiltered.slice(left * pageSize, left * pageSize + pageSize)}
    );
  }
});

module.exports = routerVersion2;
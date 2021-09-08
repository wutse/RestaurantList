'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const restaurantList = require('./restaurant.json');

const app = new express();
const port = 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// setting static files
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results });
});

app.get('/restaurants/:id', (req, res) => {
  let result = restaurantList.results.find(r => r.id.toString() === req.params.id);
  res.render('show', { restaurant: result });
});


app.get('/search', (req, res) => {
  let results = restaurantList.results.filter(r => (r.name + r.category).toUpperCase().includes(req.query.keyword.toUpperCase()));
  res.render('index', { restaurants: results, keyword: req.query.keyword });
});

app.listen(port, () => {
  console.log(`restaurant list start at ${(new Date()).toLocaleString()}.`)
});
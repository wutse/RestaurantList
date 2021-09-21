'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const Restaurant = require('./models/restaurant');

mongoose.connect('mongodb://172.31.16.1/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(err => console.log(err));

const db = mongoose.connection;

db.on('error', (err) => {
  console.log('db error!');
  console.log(err);
});

db.once('open', () => {
  console.log('db connected');
});

const app = express();
const port = 3000;

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(datas => res.render('index', { restaurants: datas }))
    .catch((err) => {
      console.log('get restaurant data error!');
      console.log(err);
    });
});

app.get('/restaurant/new', (req, res) => {
  return res.render('new')
});

app.get('/restaurant/:id', (req, res) => {
  console.log(req.params.id);
  return Restaurant.findById(req.params.id)
    .lean()
    .then(data => res.render('detail', { restaurant: data }))
    .catch(err => console.log(err));
});

app.get('/restaurant/:id/edit', (req, res) => {
  return Restaurant.findById(req.params.id)
    .lean()
    .then(data => res.render('edit', { restaurant: data }))
    .catch(err => console.log(err));
});

app.get('/search', (req, res) => {
  let results = restaurantList.filter(r => (r.name + r.category).toUpperCase().includes(req.query.keyword.toUpperCase()));
  res.render('index', { restaurants: results, keyword: req.query.keyword });
});

app.post('/restaurant', (req, res) => {
  let newData = new Restaurant();
  newData.name = req.body.name;
  newData.category = req.body.category;
  newData.location = req.body.location;
  newData.google_map = req.body.google_map;
  newData.phone = req.body.phone;
  newData.description = req.body.description;
  newData.image = req.body.image;

  return newData.save()
    .then(() => res.redirect('/'));

});

app.post('/restaurant/:id/edit', (req, res) => {
  return Restaurant.findById(req.params.id)
    .then(data => {
      data.name = req.body.name;
      data.category = req.body.category;
      data.location = req.body.location;
      data.google_map = req.body.google_map;
      data.phone = req.body.phone;
      data.description = req.body.description;
      data.image = req.body.image;

      return data.save();
    })
    .then(() => res.redirect(`/restaurants/${req.params.id}`))
    .catch(err => console.log(err));
});

app.post('/restaurant/:id/delete', (req, res) => {
  return Restaurant.findById(req.params.id)
    .then(data => data.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error));
});

app.listen(port, () => {
  console.log(`restaurant list start at ${(new Date()).toLocaleString()}.`)
});
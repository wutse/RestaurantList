'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const Restaurant = require('./models/restaurant');

mongoose.connect('mongodb://172.30.176.1/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
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
  console.log(`get /`);
  Restaurant.find()
    .lean()
    .then(datas => res.render('index', { restaurants: datas }))
    .catch((err) => {
      console.log('get restaurant data error!');
      console.log(err);
    });
});

app.get('/restaurant/new', (req, res) => {
  console.log(`get /restaurant/new`);
  return res.render('new')
});

app.get('/restaurant/:id', (req, res) => {
  console.log(`get /restaurant/${req.params.id}`);
  return Restaurant.findById(req.params.id)
    .lean()
    .then(data => res.render('detail', { restaurant: data }))
    .catch(err => console.log(err));
});

app.get('/restaurant/:id/edit', (req, res) => {
  console.log(`get /restaurant/${req.params.id}/edit`);
  return Restaurant.findById(req.params.id)
    .lean()
    .then(data => res.render('edit', { restaurant: data }))
    .catch(err => console.log(err));
});

app.get('/search', (req, res) => {
  console.log(`get /search?keyword=${req.query.keyword}`);
  Restaurant.find({
    $or: [
      { name: { $regex: `.*${req.query.keyword}.*` } },
      { name_en: { $regex: `.*${req.query.keyword}.*` } },
      { category: { $regex: `.*${req.query.keyword}.*` } }]
  })
    .lean()
    .then(datas => res.render('index', { restaurants: datas, keyword: req.query.keyword }))
    .catch((err) => {
      console.log('get restaurant data error!');
      console.log(err);
    });
});

app.post('/restaurant', (req, res) => {
  console.log(`post /restaurant`);
  let newData = new Restaurant();
  newData.name = req.body.name;
  newData.category = req.body.category;
  newData.location = req.body.location;
  newData.google_map = req.body.google_map;
  newData.phone = req.body.phone;
  newData.rating = req.body.rating;
  newData.image = req.body.image;
  newData.description = req.body.description;

  return newData.save()
    .then(() => res.redirect('/'));
});

app.post('/restaurant/:id/edit', (req, res) => {
  console.log(`post /restaurant/${req.params.id}/edit`);
  return Restaurant.findById(req.params.id)
    .then(data => {
      data.name = req.body.name;
      data.category = req.body.category;
      data.location = req.body.location;
      data.google_map = req.body.google_map;
      data.phone = req.body.phone;
      data.rating = req.body.rating;
      data.image = req.body.image;
      data.description = req.body.description;

      return data.save();
    })
    .then(() => res.redirect(`/restaurant/${req.params.id}`))
    .catch(err => console.log(err));
});

app.post('/restaurant/:id/delete', (req, res) => {
  console.log(`post /restaurant/${req.params.id}/delete`);
  return Restaurant.findById(req.params.id)
    .then(data => data.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error));
});

app.listen(port, () => {
  console.log(`restaurant list start at ${(new Date()).toLocaleString()}.`)
});
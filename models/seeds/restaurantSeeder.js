'use strict';

const mongoose = require('mongoose');
const sourceDatas = require('./restaurant.json');
const Restaurant = require('../restaurant');

mongoose.connect('mongodb://172.22.128.1/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true }).
  catch(err => console.log(err));

const db = mongoose.connection;

db.on('error', (err) => {
  console.log('db error!');
  console.log(err);
});

db.once('open', () => {
  console.log('db connected!');

  for (let i = 0; i < sourceDatas.results.length; i++) {
    Restaurant.create(sourceDatas.results[i]);
  }

  console.log('done');
});


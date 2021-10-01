'use strict';

const db = require('../../config/mongoose');
const sourceDatas = require('./restaurant.json');
const Restaurant = require('../restaurant');

db.once('open', () => {
  console.log('db connected!');

  for (let i = 0; i < sourceDatas.results.length; i++) {
    Restaurant.create(sourceDatas.results[i]);
  }

  console.log('done');
});

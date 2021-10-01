const mongoose = require('mongoose');

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

module.exports = db;
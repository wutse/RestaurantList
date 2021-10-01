const express = require('express');
const router = express.Router();
const Restaurant = require('../../models/restaurant');

router.get('/', (req, res) => {
  console.log(`get /`);
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(datas => res.render('index', { restaurants: datas, sortAsc: true }))
    .catch((err) => {
      console.log('get restaurant data error!');
      console.log(err);
    });
});

router.get('/search', (req, res) => {
  console.log(`get /search?keyword=${req.query.keyword}`);
  Restaurant.find({
    $or: [
      { name: { $regex: `.*${req.query.keyword}.*` } },
      { name_en: { $regex: `.*${req.query.keyword}.*` } },
      { category: { $regex: `.*${req.query.keyword}.*` } }]
  })
    .lean()
    .sort({ _id: req.query.sort })
    .then(datas => res.render('index', { restaurants: datas, keyword: req.query.keyword, sortAsc: (req.query.sort === 'asc') }))
    .catch((err) => {
      console.log('search restaurant data error!');
      console.log(err);
    });
});

module.exports = router;

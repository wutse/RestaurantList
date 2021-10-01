const express = require('express');
const router = express.Router();
const Restaurant = require('../../models/restaurant');

router.get('/new', (req, res) => {
  console.log(`get /restaurants/new`);
  return res.render('new')
});

router.get('/:id', (req, res) => {
  console.log(`get /restaurants/${req.params.id}`);
  return Restaurant.findById(req.params.id)
    .lean()
    .then(data => res.render('detail', { restaurant: data }))
    .catch(err => console.log(err));
});

router.get('/:id/edit', (req, res) => {
  console.log(`get /restaurants/${req.params.id}/edit`);
  return Restaurant.findById(req.params.id)
    .lean()
    .then(data => res.render('edit', { restaurant: data }))
    .catch(err => console.log(err));
});

router.post('/', (req, res) => {
  console.log(`post /restaurants`);
  console.log(req.body);
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

router.put('/:id', (req, res) => {
  console.log(`put /restaurants/${req.params.id}/edit`);
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
    .then(() => res.redirect(`/restaurants/${req.params.id}`))
    .catch(err => console.log(err));
});

router.delete('/:id', (req, res) => {
  console.log(`delete /restaurants/${req.params.id}/delete`);
  return Restaurant.findById(req.params.id)
    .then(data => data.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error));
});


module.exports = router;

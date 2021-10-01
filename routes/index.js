const express = require('express');
const router = express.Router();

const home = require('./modules/home');
router.use('/', home);

const restaurant = require('./modules/restaurant');
router.use('/restaurants', restaurant);

module.exports = router;
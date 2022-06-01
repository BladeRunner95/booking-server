const express = require('express');
const router = express.Router();
const {getBookings,setBookings, changeBookings, deleteBookings} = require('../controllers/bookingsController');


router.route('/locations/').get(getBookings).post(setBookings)
router.route('/locations/:id').put(changeBookings).delete(deleteBookings)


module.exports = router
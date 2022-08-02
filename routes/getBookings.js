const express = require('express');
const router = express.Router();
const {getBookings, getBooking, setBookings, changeBookings, deleteBookings} = require('../controllers/bookingsController');
const {verifyAdmin} = require("../middleware/verifyToken");


router.route('/').get(getBookings)
router.route('/:id').get(getBooking).post(setBookings).put(verifyAdmin, changeBookings).delete(verifyAdmin, deleteBookings)


module.exports = router
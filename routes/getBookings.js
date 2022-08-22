const express = require('express');
const router = express.Router();
const {getBookings, getBooking, getBookingsByUsername, setBookings, changeBookings, deleteBookings} = require('../controllers/bookingsController');
const {verifyAdmin, verifyUser} = require("../middleware/verifyToken");


router.route('/').get(getBookings).post(verifyAdmin, setBookings)
router.route('/byUser/:id').get(verifyUser, getBookingsByUsername)
router.route('/:id').get(getBooking).post(setBookings).put(verifyAdmin, changeBookings).delete(verifyAdmin, deleteBookings)


module.exports = router
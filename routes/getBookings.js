const express = require('express');
const router = express.Router();
const {getBookings,setBookings, changeBookings, deleteBookings} = require('../controllers/bookingsController');
const {verifyAdmin} = require("../middleware/verifyToken");


router.route('/').get(getBookings).post(setBookings)
router.route('/:id').put(verifyAdmin, changeBookings).delete(verifyAdmin, deleteBookings)


module.exports = router
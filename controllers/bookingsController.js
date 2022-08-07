const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const Location = require('../models/locationModel');
const {responseHandler} = require("../middleware/responseMiddleware");

//GET /api/bookings
const getBookings = asyncHandler(async (req, res) => {
    try {
        const bookings = await Booking.find();
        if (!bookings) {
            res.status(400)
            // res.send
            throw new Error('Bookings not found');
        }
        responseHandler(res, bookings);
        console.log(bookings)
    } catch (e) {
        console.log('catched error ' + e)
    }
})

//GET /api/bookings
const getBooking = asyncHandler(async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            res.status(400)
            // res.send
            throw new Error('Booking not found');
        }
        responseHandler(res, booking);
        console.log(booking)
    } catch (e) {
        console.log('catched error ' + e)
    }
})

//SET /api/bookings
const setBookings = asyncHandler(async (req, res) => {
    const location = req.body.location;
    if (!req.body.startDate && !req.body.finishDate) {
        res.status(400)
            throw new Error('Please add a date field')
    } else {
        const booking = await Booking.create({
            startDate: req.body.startDate,
            finishDate: req.body.finishDate,
            location: req.body.location,
            cost: req.body.cost,
            user: req.params.id,
        })
        try {
            const rangeArray = [req.body.startDate, req.body.finishDate];
            await Location.findByIdAndUpdate(location, {
                $push: {confirmedBookings: [...rangeArray]},
            })
        } catch (e) {
            console.log('setBookings error' + e);
        }
        res.status(200).json(booking)
    }
})

//PUT /api/bookings/id
const changeBookings = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        res.status(400);
        throw new Error('Booking not found');
    }
    const updateBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    responseHandler(res, updateBooking);
})
//DELETE /api/bookings/id
const deleteBookings = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        res.status(400);
        throw new Error('Booking not found');
    }
    await booking.remove();
    res.status(200).json({ id: req.params.id });
})

module.exports = {
    getBookings,
    getBooking,
    setBookings,
    changeBookings,
    deleteBookings
}

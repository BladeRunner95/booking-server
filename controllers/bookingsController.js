const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const Location = require('../models/locationModel');
const {responseHandler} = require("../middleware/responseMiddleware");
const Locations = require("../models/locationModel");

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
        // console.log(booking)
    } catch (e) {
        console.log('catched error ' + e)
    }
})

const getBookingsByUsername = asyncHandler(async (req, res) => {
    try {
        const bookings = await Booking.find({user: req.params.id});
        if (!bookings) {
            res.status(400);
            throw new Error('Bookings not found')
        }
        responseHandler(res, bookings);
    } catch (e) {
        console.log('get bookings by user error')
    }
})

//SET /api/bookings
const setBookings = asyncHandler(async (req, res) => {
    const {startDate, finishDate, location, cost, user} = req.body;
    if (!startDate && !finishDate) {
        res.status(400)
        throw new Error('Please add a date field')
    }
    try {
        const selectLocation = await Locations.findById(location);
        if (!selectLocation || !selectLocation.confirmedBookings) {
            res.status(400);
            throw new Error('Location not found');
        }
        const rangeObj = {
            startDate: startDate,
            finishDate: finishDate
        };
        let list = [];
        while (rangeObj.startDate <= rangeObj.finishDate + 1) {
            list.push(rangeObj.startDate);
            rangeObj.startDate = rangeObj.startDate + (60 * 60 * 1000);
        }

        const unavailableTime = selectLocation.confirmedBookings.some(dateObj => {
            return list.includes(dateObj.startDate) || list.includes(dateObj.finishDate);
        });

        if (unavailableTime) {
            return res.status(422).send('This time is booked');
        }
        await Location.updateOne(selectLocation, {
            $push: {confirmedBookings: {
                    startDate :startDate,
                    finishDate :finishDate,
                }},
        })
        const booking = await Booking.create({
            startDate: startDate,
            finishDate: finishDate,
            location: location,
            cost: cost,
            user: req.params.id || user,
        })
        res.status(200).json(booking);
    } catch (e) {
        console.log(e);
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
    await Location.updateOne({_id: booking.location}, {
            $pullAll: {
                confirmedBookings: [booking.startDate, booking.finishDate]
            }
        }
    );
    await booking.remove();
    res.status(200).json({id: req.params.id});
})

module.exports = {
    getBookings,
    getBooking,
    getBookingsByUsername,
    setBookings,
    changeBookings,
    deleteBookings
}

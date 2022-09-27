const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const Location = require('../models/locationModel');
const User = require('../models/userModel');
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
        const selectLocation = await Location.findById(location);
        if (!selectLocation || !selectLocation.confirmedBookings) {
            res.status(400);
            throw new Error('Location not found');
        }
        const rangeObj = {
            startDate: startDate,
            finishDate: finishDate
        };
        let list = [];
        while (rangeObj.startDate <= rangeObj.finishDate) {
            list.push(rangeObj.startDate);
            rangeObj.startDate = rangeObj.startDate + (60 * 60 * 1000);
        }
        list.push(rangeObj.finishDate);
        const unavailableTime = selectLocation.confirmedBookings.some(dateObj => {
            // return list.includes(dateObj.startDate) || list.includes(dateObj.finishDate);
            if (list.includes(dateObj.startDate)) {
                return true;
            }
            if (list.includes(dateObj.finishDate)) {
                return true;
            }
            if (list[0]> dateObj.startDate && list[list.length-1] <= dateObj.finishDate) {
                return true;
            }
            if (list[0]> dateObj.startDate && list[0] < dateObj.finishDate) {
                return true;
            }
        });

        if (unavailableTime) {
            return res.status(422).send('This time is booked');
        }
        const findUser = await User.findById(req.params.id || user);

        const booking = await Booking.create({
            startDate: startDate,
            finishDate: finishDate,
            location: location,
            locationName: selectLocation.title,
            cost: cost,
            user: req.params.id || user,
            username: findUser.username
        })
        await Location.updateOne(selectLocation, {
            $push: {
                confirmedBookings: {
                    _id: booking._id,
                    startDate: startDate,
                    finishDate: finishDate,
                }
            },
        })
        res.status(200).json(booking);
    } catch (e) {
        res.status(422).send(e)
        console.log(e);
    }
})

//PUT /api/bookings/id
const changeBookings = asyncHandler(async (req, res) => {
    const {startDate, finishDate, location, cost, user} = req.body;
    const {id} = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
        res.status(400);
        throw new Error('Booking not found');
    }

    //need to add check if new dates are available

    await Location.findOneAndUpdate(
        {"confirmedBookings._id": id},
        {
            'confirmedBookings.$.startDate': startDate,
            'confirmedBookings.$.finishDate': finishDate,
        }, {new: true}
    )

    const findUser = await User.findById(user);
    const findLocation = await Location.findById(location);

    const updateBooking = await Booking.findByIdAndUpdate(id, {
        startDate: startDate,
        finishDate: finishDate,
        cost: cost,
        location: location,
        locationName: findLocation.title,
        user: user,
        username: findUser.username
    }, {
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
    await Location.findOneAndUpdate({_id: booking.location},
        {$pull: {'confirmedBookings': {_id: req.params.id}}});
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

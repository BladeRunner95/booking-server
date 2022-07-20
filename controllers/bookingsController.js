const asyncHandler = require('express-async-handler')

const Booking = require('../models/bookingModel')

//GET /api/bookings
const getBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find()
    res.status(200).json(bookings);
})
//SET /api/bookings
const setBookings = asyncHandler(async (req, res) => {
    if (!req.body.startDate && !req.body.finishDate) {
        res.status(400)
            throw new Error('Please add a date field')
    } else {
        const booking = await Booking.create({
            startDate: req.body.startDate,
            finishDate: req.body.finishDate,
            location: req.body.location,
            user: req.body.user,
        })
        res.status(200).json(booking)
    }
})

//PUT /api/bookings/id
const changeBookings = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
        res.status(400);
        throw new Error('Booking not found')
    }
    const updateBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })
        res.status(200).json(updateBooking)
})
//DELETE /api/bookings/id
const deleteBookings = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
        res.status(400)
        throw new Error('Booking not found')
    }
    await booking.remove()
    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getBookings,
    setBookings,
    changeBookings,
    deleteBookings
}

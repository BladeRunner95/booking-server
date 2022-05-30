const asyncHandler = require('express-async-handler')
//GET /api/bookings
const getBookings = asyncHandler(async (req, res) => {
    res.status(200).json({message: 'Get Goals'});
})
//SET /api/bookings
const setBookings = asyncHandler(async (req, res) => {
    if (!req.body.pipi) {
        res.status(400)
            throw new Error('Please add a pipi field')
    } else {
        res.status(200).json({message: 'Set goal'})
    }
})

//PUT /api/bookings/id
const changeBookings = asyncHandler(async (req, res) => {
    res.status(200).json({message: `Update Goal ${req.params.id}`})
})
//DELETE /api/bookings/id
const deleteBookings = asyncHandler(async (req, res) => {
    res.status(200).json({message: `Delete Goal ${req.params.id}`})
})

module.exports = {
    getBookings,
    setBookings,
    changeBookings,
    deleteBookings
}

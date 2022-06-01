const asyncHandler = require('express-async-handler')

const Filter = require('../models/filterModel')

//GET /api/bookings
const getFilters = asyncHandler(async (req, res) => {
    const filters = await Filter.find()
    res.status(200).json(filters);
})
//SET /api/bookings
const setFilters = asyncHandler(async (req, res) => {
    if (!req.body) {
        res.status(400)
        throw new Error('Please add required fields')
    } else {
        const filters = await Filter.create({
            title: req.body.title,
            value: req.body.value
        })
        res.status(200).json(filters)
    }
})

//PUT /api/bookings/id
const changeFilters = asyncHandler(async (req, res) => {
    const filters = await Filter.findById(req.params.id)
    if (!filters) {
        res.status(400);
        throw new Error('Filters not found')
    }
    const updateFilter = await Filter.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })
    res.status(200).json(updateFilter)
})
//DELETE /api/bookings/id
const deleteFilters = asyncHandler(async (req, res) => {
    const filters = await Filter.findById(req.params.id)
    if (!filters) {
        res.status(400)
        throw new Error('Booking not found')
    }
    await filters.remove()
    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getFilters,
    setFilters,
    changeFilters,
    deleteFilters
}

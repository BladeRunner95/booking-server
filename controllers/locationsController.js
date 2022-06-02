const asyncHandler = require('express-async-handler')

const Locations = require('../models/locationModel')

//GET all /api/locations
const getLocations = asyncHandler(async (req, res) => {
    const locations = await Locations.find();
    if (!locations) {
        res.status(400);
        throw new Error('Locations not found');
    }
    res.status(200).json(locations);
})

//GET by id /api/locations
const getLocation = asyncHandler(async (req, res) => {
    const location = await Locations.findById(req.params.id);
    if (!location) {
        res.status(400);
        throw new Error('Location not found');
    }
    res.status(200).json(location);
})

//GET all locations by title matched api/locations/:title
const getLocationsNames = asyncHandler(async (req, res) => {
    const locations = await Locations.find({title: req.params.title});
    if (!locations) {
        res.status(400);
        throw new Error('Location not found');
    }
    res.status(200).json(locations);
})

//SET /api/locations
const setLocation = asyncHandler(async (req, res) => {
    if (!req.body) {
        res.status(400)
        throw new Error('Please add required fields')
    } else {
        const location = await Locations.create({
            title: req.body.title,
            price: req.body.price,
            name: req.body.name,
            capacity: req.body.capacity,
            images: req.body.images,
            details: req.body.details,
            confirmedBookings: req.body.confirmedBookings
        })
        res.status(200).json(location)
    }
})

//PUT /api/locations/id
const changeLocation = asyncHandler(async (req, res) => {
    const location = await Locations.findById(req.params.id);
    if (!location) {
        res.status(400);
        throw new Error('Location not found');
    }
    const updateLocation = await Location.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.status(200).json(updateLocation);
})
//DELETE /api/locations/id
const deleteLocation = asyncHandler(async (req, res) => {
    const location = await Locations.findById(req.params.id);
    if (!location) {
        res.status(400);
        throw new Error('Location not found');
    }
    await location.remove();
    res.status(200).json({ id: req.params.id });
})

module.exports = {
    getLocations,
    getLocation,
    getLocationsNames,
    setLocation,
    changeLocation,
    deleteLocation
}
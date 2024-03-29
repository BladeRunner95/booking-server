const asyncHandler = require('express-async-handler');

const Locations = require('../models/locationModel');
const {responseHandler} = require("../middleware/responseMiddleware");

//GET all /api/locations
const getLocations = asyncHandler(async (req, res) => {
    const locations = await Locations.find();
    if (!locations) {
        res.status(400);
        throw new Error('Locations not found');
    }
    responseHandler(res, locations)
});

const getAllLocationsNames = asyncHandler(async (req, res) => {
    const locations = await Locations.find();
    if (!locations) {
        res.status(400);
        throw new Error('Locations not found');
    }
    let getNames = locations.map(locationObj => locationObj.title);
    res.status(200).json([...new Set(getNames)]);
});

//GET by id /api/locations
const getLocation = asyncHandler(async (req, res) => {
    const location = await Locations.findById(req.params.id);
    if (!location) {
        res.status(400);
        throw new Error('Location not found');
    } else {
       responseHandler(res, location);
    }
});

//GET all locations by title matched api/locations/:title and with free chosen time
const getLocationByName = asyncHandler(async (req, res) => {
    const locations = await Locations.find({title: req.params.title});
    const {timeRange} = req.body;
    if (!locations) {
        res.status(400);
        throw new Error('Locations not found');
    }

    const availableLocations = await locations.filter(location => {
        return !location.confirmedBookings.some(dateObj =>{
            // return timeRange.includes(dateObj.startDate) || timeRange.includes(dateObj.finishDate);
            if (timeRange.includes(dateObj.startDate)) {
                return true;
            }
            if (timeRange.includes(dateObj.finishDate)) {
                return true;
            }
            if (timeRange[0]> dateObj.startDate && timeRange[timeRange.length-1] <= dateObj.finishDate) {
                return true;
            }
            if (timeRange[0]> dateObj.startDate && timeRange[0] < dateObj.finishDate) {
                return true;
            }
        })
    })
    res.status(200).json(availableLocations);

});

//SET /api/locations
const setLocation = asyncHandler(async (req, res) => {
    try {
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
            })
            res.status(200).json(location)
        }
    } catch (e) {
        res.status(400);
        res.send(e);
    }
});

//PUT /api/locations/id
const changeLocation = asyncHandler(async (req, res) => {
    try {
        const location = await Locations.findById(req.params.id);
        if (!location) {
            res.status(400);
            throw new Error('Location not found');
        }
        const updateLocation = await Locations.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        responseHandler(res, updateLocation);
    } catch (e) {
        console.log("here is an error" + e );
    }
});
//DELETE /api/locations/id
const deleteLocation = asyncHandler(async (req, res) => {
    const location = await Locations.findById(req.params.id);
    if (!location) {
        res.status(400);
        throw new Error('Location not found');
    }
    await location.remove();
    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getLocations,
    getAllLocationsNames,
    getLocation,
    getLocationByName,
    setLocation,
    changeLocation,
    deleteLocation
};
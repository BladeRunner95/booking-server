const mongoose = require('mongoose');

const locationsSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a location title (string)']
    },
    name: {
        type: String,
        required: [true, 'Please add a location name (string)']
    },
    price: {
        type: Number,
        required: [true, 'Please add location price (number)']
    },
    capacity: {
        type: Number,
        required: [true, 'Please add location capacity (number)']
    },
    images: {
        type: []
    },
    details: {
        type: []
    },
    confirmedBookings: {
        type: []
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Locations', locationsSchema)
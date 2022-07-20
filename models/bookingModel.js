const mongoose = require('mongoose');
const User = require('./userModel');
const Location = require('./locationModel');

const bookingSchema = mongoose.Schema({
    startDate: {
        type: Number,
        required: [true, 'Please add a text value']
    },
    finishDate: {
        type: Number,
        required: [true, 'Please add a text value']
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Location
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Booking', bookingSchema)
const mongoose = require('mongoose');
const Booking = require('./bookingModel');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add username (string)'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please add user email (string)'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add user password']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    bookings: {
        type: [String],
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)
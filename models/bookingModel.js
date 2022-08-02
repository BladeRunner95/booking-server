const mongoose = require('mongoose');
const User = require('./userModel');
const Location = require('./locationModel');

const bookingSchema = mongoose.Schema({
    startDate: {
        type: Number,
        required: [true, 'Please add a valid Date']
    },
    finishDate: {
        type: Number,
        required: [true, 'Please add a valid Date']
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Location
    },
    cost: {
      type: Number,
      required: [true, 'Total cost is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Booking', bookingSchema)
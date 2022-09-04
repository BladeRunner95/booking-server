const mongoose = require('mongoose');
const User = require('./userModel');

const accessHashSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    expireAt: {
        type: Date,
        default: new Date(new Date().getTime() + 600000)
    }
})

module.exports = mongoose.model('AccessHash', accessHashSchema);
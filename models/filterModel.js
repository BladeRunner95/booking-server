const mongoose = require('mongoose');

const filterSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a filter string']
    },
    value: {
        type: []
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Filter', filterSchema)
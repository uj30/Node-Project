const mongoose = require('mongoose');

const brand = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Brand', brand);
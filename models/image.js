const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    filename: String,
    mimetype: String,
    size: Number
    // Add more fields as needed
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
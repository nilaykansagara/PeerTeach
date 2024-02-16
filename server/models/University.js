const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    pincode: {
        type: Number,
    },
    
});

const University = mongoose.model("universities", UniversitySchema);
module.exports = University;

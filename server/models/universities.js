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
    nickname: {
        type: String
    },
    programs: [{
        courses: [{
            type: String,
            required: true
        }],
        branches: [{
            type: String
        }],
        total_sems: [{
            type: Number,
            required: true
        }]

    }]

});

const University = mongoose.model("universities", UniversitySchema);
module.exports = University;

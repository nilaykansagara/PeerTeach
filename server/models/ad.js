const mongoose = require('mongoose');
const Businessman = require('./Businessman');

const adSchema = new mongoose.Schema({
    slots: {
        type: Number,
        required: true
    },
    adPath: {
        type: String,
        required: true,
    },
    secs: {
        type: Number,
        required: true
    },
    purchaseDate:{
        type: Date,
        required: true
    },
    AllotDate:{
        type: Date,
    },
    Businessman_email:{
        type: String,
        required: true
    },
    run_flag:{
        type: Boolean,
        required:true,
        default:0,
    }
});

const AdModel = mongoose.model("ads", adSchema);
module.exports = AdModel;

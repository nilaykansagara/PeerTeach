const mongoose = require('mongoose');
const Businessman = require('./Businessman');

const billSchema = new mongoose.Schema({
    busi_name: {
        type: String,
        required: true,
    },
    slots: {
        type: Number,
        required: true,
    },
    adPath: {
        type: String,
        required: true,
    },
    secs: {
        type: Number,
        required: true
    },
    purchaseDate: {
        type: Date,
        required: true
    },
    AllotDate: {
        type: Date,
    },
    Businessman_email: {
        type: String,
        required: true
    },
    purchasePrice: {
        type: Number,
        required: true,
    },
    college_name: {
        type: String,
        required: true,
    },
    no_of_users: {
        type: Number,
        required: true,
    },
    video_ids: [{
        type: String,
    }],
    run_flag: {
        type: Boolean,
        required: true,
        default: 0,
    }
});

const BillModel = mongoose.model("bills", billSchema);
module.exports = BillModel;

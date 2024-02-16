const mongoose = require('mongoose');

const BusinessmanSchema = new mongoose.Schema({
    owner_name: {
        type: String,
        required: true
    },
    phone_number: {
        type: Number,
        required: true
    },
    shop_name: {
        type: String,
        required: true
    },
    business_description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
});

const Businessman = mongoose.model("businessman", BusinessmanSchema);
module.exports = Businessman;

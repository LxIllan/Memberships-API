const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const receiptSchema = new mongoose.Schema({
    membership: String,
    price: Number,
    boughtBy: { 
        type: ObjectId,
        ref: 'Member'
    },
    soldBy: { 
        type: ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Receipt', receiptSchema);
const mongoose = require('mongoose');

const membershipSchema = mongoose.Schema({
    membership: {
        type: String,
        trim: true,
        required: true
    },
    months: Number,
    weeks: Number,
    price: {
        type: Number,
        default: 0
    },
    specialHours: {
        startHour: Number,
        endHour: Number
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Membership', membershipSchema);

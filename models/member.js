const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const memberSchema = mongoose.Schema({
    code: String,
    name: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    email: {
        type: String,
        trim: true
    },
    membership: {
        type: ObjectId,
        ref: 'Membership'
    },
    endMembership: Date,
    attendances: [{ type: Date }],
    payments: [
        {
            date: { type: Date, default: Date.now },
            membership: { type: ObjectId, ref: 'Membership' }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Member', memberSchema);

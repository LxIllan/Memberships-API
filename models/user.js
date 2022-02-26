const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const uuidv1 = require('uuidv1');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
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
    email: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String
    },
    role: {
        type: String,
        default: 'receptionist'
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    photo: {
        data: Buffer,
        contentType: String
    },
    resetPasswordLink: {
        data: String,
        default: ''
    }
}, {
    timestamps: true
});

// Virtual field
userSchema.virtual('password')
    .set(function(password) {
        // Create temporary variable called password
        this._password = password;
        // generate a timestamp
        this.salt = uuidv1();
        // encryptPassword
        this.hashed_password = this.encryptPassword(password);
    })
    .get(() => this._password);

userSchema.methods = {
    authenticate: function(passwordPlainText) {
        return this.encryptPassword(passwordPlainText) === this.hashed_password;
    },
    encryptPassword: function(password) {
        if (!password) return "";
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return "";
        }
    }
}

module.exports = mongoose.model('User', userSchema);
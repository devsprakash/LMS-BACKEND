const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const constants = require('../config/constants');
const dateFormat = require('../helper/dateformat.helper');
const { JWT_SECRET } = require('../keys/keys');



// Define user schema
const userSchema = new mongoose.Schema({

    full_name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    course_name: {
        type: String
    },
    user_type: {
        type: Number,
        default: 2
    },
    status: {
        type: Number, default:
            constants.STATUS.ACTIVE
    },
    signup_status: {
        type: Number,
        default: 1
    },
    gender: {
        type: String,
        default: null
    },
    social_media: {
        type: String
    },
    password:{
        type:String
    },
    city: {
        type: String,
    },
    device_token: {
        type: String,
        default: null
    },
    device_type: {
        type: Number,
        default: null
    },
    reset_password_token:{
        type: String,
        default:null
    },
    tokens: {
        type: String,
        default: null
    },
    refresh_tokens: {
        type: String,
        default: null
    },
    tempTokens: {
        type: String
    },
    term_and_condition:{
        type:Boolean
    },
    privacy_policy:{
        type:Boolean
    },
    created_at: {
        type: String
    },
    updated_at: {
        type: String
    },
    deleted_at: {
        type: String,
        default: null
    }
});

// Index email field
userSchema.index({ "email": 1 });

// Method to validate password
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// Method to convert user object to JSON
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    return userObject;
};

// Static method to find user by credentials
userSchema.statics.findByCredentials = async function (email, password, user_type) {
    const user = await this.findOne({
        $or: [{ email: email }, { user_name: email }],
        user_type: user_type,
        deleted_at: null
    });

    if (!user) {
        return 1;
    }

    if (!user.validPassword(password)) {
        return 2;
    }

    return user;
};

// Method to generate authentication token
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = await jwt.sign({
        _id: user._id.toString()
    }, JWT_SECRET, { expiresIn: '24h' });
    user.tokens = token;
    user.updated_at = await dateFormat.set_current_timestamp();
    user.refresh_tokens_expires = await dateFormat.add_time_current_date(7, 'days');
    await user.save();
    return token;
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = async function () {
    const user = this;
    const refresh_tokens = await jwt.sign({
        _id: user._id.toString()
    }, JWT_SECRET);
    user.refresh_tokens = refresh_tokens;
    user.updated_at = await dateFormat.set_current_timestamp();
    await user.save();
    return refresh_tokens;
};


const User = mongoose.model('users', userSchema);
module.exports = User;

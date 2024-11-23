const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const constants = require('../config/constants');
const dateFormat = require('../helper/dateformat.helper');
const { JWT_SECRET } = require('../keys/keys');



// Define user schema
const adminSchema = new mongoose.Schema({

    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    user_type: {
        type: String,
        default: "SUPER ADMIN"
    },
    status: {
        type: Number, default:
        constants.STATUS.ACTIVE
    },
    signup_status: {
        type: Number,
        default: 1
    },
    password:{
        type:String
    },
    device_token: {
        type: String,
        default: null
    },
    device_type: {
        type: Number,
        default: null
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
adminSchema.index({ "email": 1 });

// Method to validate password
adminSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// Method to convert admin object to JSON
adminSchema.methods.toJSON = function () {
    const admin = this;
    const adminObject = admin.toObject();
    return adminObject;
};

// Static method to find admin by credentials
adminSchema.statics.findByCredentials = async function (email, password) {
    const admin = await this.findOne({
        $or: [{ email: email }, { admin_name: email }],
        deleted_at: null
    });

    if (!admin) {
        return 1;
    }

    if (!admin.validPassword(password)) {
        return 2;
    }

    return admin;
};

// Method to generate authentication token
adminSchema.methods.generateAuthToken = async function () {
    const admin = this;
    const token = await jwt.sign({
        _id: admin._id.toString()
    }, JWT_SECRET, { expiresIn: '48h' });
    admin.tokens = token;
    admin.updated_at = await dateFormat.set_current_timestamp();
    admin.refresh_tokens_expires = await dateFormat.add_time_current_date(7, 'days');
    await admin.save();
    return token;
};

// Method to generate refresh token
adminSchema.methods.generateRefreshToken = async function () {
    const admin = this;
    const refresh_tokens = await jwt.sign({
        _id: admin._id.toString()
    }, JWT_SECRET);
    admin.refresh_tokens = refresh_tokens;
    admin.updated_at = await dateFormat.set_current_timestamp();
    await admin.save();
    return refresh_tokens;
};


const Admin = mongoose.model('admins', adminSchema);
module.exports = Admin;

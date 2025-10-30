const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    provider: String,
    providerId: String,
    displayName: String,
    email: String,
    avatar: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    term: String,
    timestamp: { type: Date, default: Date.now }
});

searchSchema.index({ term: 1 });
searchSchema.index({ userId: 1 });

module.exports = mongoose.model('Search', searchSchema);
const mongoose = require('mongoose');
const productService = require('../services/productService');

const languageSchema = new mongoose.Schema({
    productId: {
        type: Number,
        ref: 'Product',
    },
    languages: [{
        language: {
            type: String,
            required: true
        },
        interface: {
            type: Boolean,
            required: true
        },
        fullAudio: {
            type: Boolean,
            required: true
        },
        subtitles: {
            type: Boolean,
            required: true
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Language = mongoose.model('Language', languageSchema);

module.exports = Language;

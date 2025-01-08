const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
    }, { timestamps: true, }
);

const Feature = mongoose.model("Feature", featureSchema);
module.exports = Feature;
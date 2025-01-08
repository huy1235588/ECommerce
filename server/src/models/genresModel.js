const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
    }, { timestamps: true, }
);

const Genre = mongoose.model("Genre", genreSchema);
module.exports = Genre;
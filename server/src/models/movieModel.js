const { default: mongoose } = require("mongoose");

const movieSchema = new mongoose.Schema({
    game_id: { type: mongoose.Schema.Types.Number, required: true }, // Liên kết với steam_appid của game
    id: Number,
    name: String,
    thumbnail: String,
    webm: {
        480: String,
        max: String
    },
    mp4: {
        480: String,
        max: String
    },
    highlight: Boolean
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
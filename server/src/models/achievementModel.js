const { default: mongoose } = require("mongoose");

const achievementSchema = new mongoose.Schema({
    game_id: { type: mongoose.Schema.Types.Number, required: true }, // Liên kết với steam_appid của game
    total: Number,
    highlighted: [{
        name: String,
        path: String
    }]
});

const Achievement = mongoose.model('Achievement', achievementSchema);
module.exports = Achievement;
const { default: mongoose } = require("mongoose");

const achievementSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.Number, required: true }, // Liên kết với steam_appid của game
    total: Number,
    highlighted: [{
        name: String,
        path: String
    }]
});

const Achievement = mongoose.model('Achievement', achievementSchema);
module.exports = Achievement;
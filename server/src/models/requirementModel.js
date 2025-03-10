const { default: mongoose } = require("mongoose");

const requirementSchema = new mongoose.Schema({
    game_id: { type: mongoose.Schema.Types.Number, required: true }, // Liên kết với steam_appid của game
    type: { type: String, enum: ['pc', 'mac', 'linux'] }, // Phân biệt loại yêu cầu
    minimum: String,
    recommended: String
});

const Requirement = mongoose.model('Requirement', requirementSchema);
module.exports = Requirement;
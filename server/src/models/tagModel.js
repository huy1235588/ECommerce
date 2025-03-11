const { default: mongoose } = require("mongoose");

const tagSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.Number, required: true }, // Liên kết với steam_appid của game
    id: Number,
    name: String   
});

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
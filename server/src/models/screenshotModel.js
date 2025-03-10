const { default: mongoose } = require("mongoose");

const screenshotSchema = new mongoose.Schema({
    game_id: { type: mongoose.Schema.Types.Number, ref: 'Game', required: true },
    id: Number,
    path_thumbnail: String,
    path_full: String
});

const Screenshot = mongoose.model('Screenshot', screenshotSchema);
module.exports
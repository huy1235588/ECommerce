const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
   // Tham chiếu đến product
    productId: {
        type: Number,
        ref: 'Product',
        required: true
    },

    // Mảng các thành tựu
    achievements: [{
        // Tên thành tựu
        title: {
            type: String,
            default: null
        },
        // Mô tả
        description: {
            type: String,
            default: null
        },
        // Phần trăm người chơi đạt được
        percent: {
            type: Number,
            default: 0
        },
        // Ảnh
        image: {
            type: String,
            default: null
        }
    }],
});

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;
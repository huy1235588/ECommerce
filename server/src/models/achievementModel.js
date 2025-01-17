const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
   // productId Tham chiếu đến product
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
            required: true
        },
        // Mô tả
        description: {
            type: String,
            required: true
        },
        // Phần trăm người chơi đạt được
        percent: {
            type: Number,
            required: true
        },
        // Ảnh
        image: {
            type: String,
            required: true
        }
    }],
});

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;
const mongoose = require('mongoose');
const getNextSequenceValue = require('../utils/autoIncrement');

const productSchema = new mongoose.Schema(
    {
        productId: {
            type: Number,
            unique: true,
        },

        // Thông tin sản phẩm
        title: {
            type: String,
            required: true,
            unique: true,
        },

        // Loại sản phẩm
        type: {
            type: String,
            required: true,
        },

        // Mô tả sản phẩm
        description: {
            type: String,
        },

        // Mô tả chi tiết sản phẩm
        detail: {
            type: String,
        },

        // Giá sản phẩm
        price: {
            type: Number,
            required: true,
            min: 0,
        },

        // Giảm giá
        discount: {
            type: Number,
            default: 0,
        },
        discountStartDate: {
            type: Date,
        },
        discountEndDate: {
            type: Date,
        },

        // Ngày phát hành
        releaseDate: {
            type: Date,
            default: Date.now,
        },

        // Nhà phát triển và phát hành
        developer: [{
            type: String,
            required: true,
        }],

        // Nhà xuất bản
        publisher: [{
            type: String,
            required: true,
        }],

        // Nền tảng hỗ trợ
        platform: [{
            type: String,
            required: true,
        }],

        // Đánh giá sản phẩm
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        // Trạng thái sản phẩm
        isActive: {
            type: Boolean,
            default: true,
        },

        // Hình ảnh đại diện
        headerImage: {
            type: String,
        },

        // Danh sách hình ảnh
        screenshots: [{
            type: String,
            required: true,
        }],

        // Video
        videos: [
            {
                // Đường dẫn video mp4
                mp4: {
                    type: String,
                },
                // Đường dẫn video webm
                webm: {
                    type: String,
                },
                // Hình ảnh đại diện cho video
                thumbnail: {
                    type: String,
                },
            },
        ],

        // Danh sách thể loại
        genres: [{
            type: String
        }],

        // Danh sách thẻ liên quan
        tags: [{
            type: String
        }],

        // Danh sách tính năng đặc biệt
        features: [{
            type: String
        }],

        // Danh sách cấu hình yêu cầu
        systemRequirements: {
            win: [{
                title: String,
                minimum: String,
                recommended: String
            }],
            mac: [{
                title: String,
                minimum: String,
                recommended: String
            }],
            linux: [{
                title: String,
                minimum: String,
                recommended: String
            }],
        },

        // Ngày tạo
        createdAt: {
            type: Date,
            default: Date.now,
        },

        // Ngày cập nhật
        updatedAt: {
            type: Date,
            default: Date.now,
        },

    }, {
    timestamps: true,
});

// Tạo productId tự tăng
productSchema.pre('insertMany', async function (next, docs) {
    try {
        // Duyệt qua từng sản phẩm
        for (let doc of docs) {
            if (!doc.productId) {
                // Tạo productId tự tăng
                doc.productId = await getNextSequenceValue('productId');
            }
        }

    } catch (error) {
        return next(error);
    }

    next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
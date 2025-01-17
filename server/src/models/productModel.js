const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = new mongoose.Schema(
    {
        _id: {
            type: Number,
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

        // Ngôn ngữ hỗ trợ
        languages: {
            interface: [{
                type: String,
            }],
            fullAudio: [{
                type: String,
            }],
            subtitles: [{
                type: String,
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
    _id: false, // Tắt tự động tạo _id
    timestamps: true,
}
);

// Add auto-increment plugin
productSchema.plugin(AutoIncrement, {
    id: 'product_seq', // Tên bộ đếm
    inc_field: '_id', // Tên trường chứa giá trị tự tăng
    start_seq: 1 // Giá trị bắt đầu
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
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
        developer: {
            type: String,
            required: true,
        },
        // Nhà xuất bản
        publisher: {
            type: String,
            required: true,
        },
        // Nền tảng hỗ trợ
        platform: {
            type: String,
            enum: ["Windows", "Mac", "Linux"],
            required: true,
        },
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
            required: true,
        },

        // Danh sách hình ảnh
        images: [
            {
                // Đường dẫn hình ảnh
                path: {
                    type: String,
                    required: true,
                },
                // Mô tả hình ảnh
                alt: {
                    type: String,
                }
            },
        ],

        // Video
        videos: [
            {
                // Đường dẫn video
                path: {
                    type: String,
                    required: true,
                },
                // Hình ảnh đại diện cho video
                poster: {
                    type: String,
                    required: true,
                },
                // Mô tả video
                alt: {
                    type: String,
                }
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
        _id: false  // Disable automatic _id generation
    }
);

// Add auto-increment plugin
productSchema.plugin(AutoIncrement, {
    id: 'product_seq',
    inc_field: '_id',
    start_seq: 1
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
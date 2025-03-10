const mongoose = require('mongoose');
const getNextSequenceValue = require('../utils/autoIncrement');

const productSchema = new mongoose.Schema(
    {
        _id: {
            type: Number,
            required: true,
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

        // Danh sách dlc
        dlc: [{
            type: String,
        }],

        // Mô tả ngắn gọn sản phẩm
        short_description: {
            type: String,
        },

        // Mô tả chi tiết sản phẩm
        detailed_description: {
            type: String,
        },

        // Thông tin về sản phẩm
        about_the_game: {
            type: String,
        },

        // Ngôn ngữ hỗ trợ
        supported_languages: {
            type: String,
        },

        // Đánh giá sản phẩm
        reviews: {
            type: String,
        },

        // Hình ảnh đại diện
        header_image: {
            type: String,
        },

        // Hình ảnh ảo
        capsule_image: {
            type: String,
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

        // Thông tin giá sản phẩm
        price_overview: {
            // Loại tiền tệ
            currency: {
                type: String,
            },
            // Giá gốc
            initial: {
                type: Number,
            },
            // Giá sau khi giảm giá
            final: {
                type: Number,
            },
            // Phần trăm giảm giá
            discount_percent: {
                type: Number,
            },
        },

        // Danh sách gói sản phẩm
        packages: [{
            type: Number,
        }],

        // Nền tảng hỗ trợ
        platform: {
            windows: {
                type: Boolean,
                default: true,
            },
            mac: {
                type: Boolean,
                default: false,
            },
            linux: {
                type: Boolean,
                default: false,
            },
        },

        categories: [{
            id: {
                type: Number,
            },
            description: {
                type: String,
            },
        }],

        // Danh sách thể loại
        genres: [{
            id: {
                type: Number,
            },
            description: {
                type: String,
            },
        }],

        // Ngày phát hành
        release_date: {
            coming_soon: {
                type: Boolean,
                default: false,
            },
            date: {
                type: String,
            },
        },

        // URL nền
        background: {
            type: String,
        },

        // URL nền (raw)
        background_raw: {
            type: String,
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

        // Tham chiếu đến các collection khác
        // Danh sách screenshots
        screenshots: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Screenshot',
        }],
        // Danh sách movies
        movies: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie',
        }],

        // Danh sách achievements
        achievements: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Achievement',
        }],
        // Danh sách package_groups
        package_groups: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PackageGroup',
        }],

        // Danh sách pc_requirements
        pc_requirements: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Requirement',
        },
        // Danh sách mac_requirements
        mac_requirements: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Requirement',
        },
        // Danh sách linux_requirements
        linux_requirements: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Requirement',
        },

    }, {
    timestamps: true,
    _id: false,
});

// middleware để tạo _id tự tăng
productSchema.pre('save', async function (next) {
    try {
        // Chỉ tạo _id tự tăng khi tạo mới sản phẩm
        if (this.isNew) {
            this._id = await getNextSequenceValue('productid');
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
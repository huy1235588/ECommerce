const path = require('path');
const { body, validationResult } = require('express-validator');
const Product = require('../models/productModel');

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];
const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.avi', '.mkv', '.mov', '.webm'];

// Hàm kiểm tra xem đúng định dạng file extension không
const isValidFileExtension = (file, allowedExtensions) => {
    const fileExtension = path.extname(file);
    return allowedExtensions.includes(fileExtension);
};

// Hàm kiểm tra xem file có tồn tại không
const validateFiles = (field, allowedExtensions) => {
    return body(field)
        .isArray({ min: 1 }).withMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`)
        .custom(value => {
            value.forEach((file, index) => {
                if (!file.path) {
                    throw new Error(`${field} at index ${index} must have a path`);
                }
                if (!isValidFileExtension(file.path, allowedExtensions)) {
                    throw new Error(`Invalid ${field} format at index ${index}. Allowed formats: ${allowedExtensions.join(', ')}`);
                }
            });
            return true;
        });
};

// Hàm kiểm tra xem title có tồn tại trong Database không
const validateTitle = async value => {
    const product = await Product.findOne({ title: value });
    if (product) {
        throw new Error('Title already exists');
    }
    return true;
};

const productValidation = [
    // Kiểm tra xem title có tồn tại trong Database không
    body('title')
        .not().isEmpty().withMessage('Title is required')
        .custom(validateTitle),

    body('type').not().isEmpty().withMessage('Type is required'),
    body('description').not().isEmpty().withMessage('Description is required'),

    // Kiểm tra xem giá sản phẩm có phải là số không
    body('price')
        .not().isEmpty().withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    // Kiểm tra xem giảm giá có phải là số không
    body('discount')
        .not().isEmpty().withMessage('Discount is required')
        .isInt({ min: 0 }).withMessage('Discount must be a positive number'),

    // Nếu discount lớn hơn 0 thì mới kiểm tra ngày bắt đầu và kết thúc giảm giá
    body('discountStartDate')
        .custom((value, { req }) => {
            if (req.body.discount > 0 && !value) {
                throw new Error('Discount start date is required');
            }

            // Kiểm tra định dạng ngày 
            else if (!new Date(value).toISOString()) {
                throw new Error('Invalid date format');
            }

            // Kiểm tra ngày bắt đầu giảm giá phải lớn hơn ngày hiện tại
            else if (value < new Date().toISOString()) {
                throw new Error('Discount start date must be greater than current date');
            }
            
            return true;
        }),
    body('discountEndDate')
        .custom((value, { req }) => {
            if (req.body.discount > 0 && !value) {
                throw new Error('Discount end date is required');
            }

            // Kiểm tra định dạng ngày
            else if (!new Date(value).toISOString()) {
                throw new Error('Invalid date format');
            }

            // Kiểm tra ngày kết thúc giảm giá phải lớn hơn ngày bắt đầu giảm giá
            else if (value < req.body.discountStartDate) {
                throw new Error('Discount end date must be greater than discount start date');
            }

            return true;
        }),

    // Kiểm tra xem ngày phát hành có hợp lệ không
    body('releaseDate')
        .not().isEmpty().withMessage('Release date is required')
        .isISO8601().withMessage('Invalid date format'),

    body('developer').not().isEmpty().withMessage('Developer is required'),
    body('publisher').not().isEmpty().withMessage('Publisher is required'),

    // Kiểm tra platform có ít nhất 1 phần tử không
    body('platform').isArray().withMessage('Platform must be an array')
        .custom(value => {
            if (value.length < 1) {
                throw new Error('Platform must have at least 1 item');
            }
            return true;
        }),

    // Kiểm tra xem trạng thái sản phẩm có phải là boolean không
    body('isActive')
        .not().isEmpty().withMessage('isActive is required')
        .isBoolean().withMessage('isActive must be a boolean'),

    // Kiểm tra định dạng của ảnh [jpeg, png, jpg, gif] 
    body('headerImage')
        .not().isEmpty().withMessage('Image is required')
        .custom(value => {
            const fileExtension = path.extname(value);
            if (!ALLOWED_IMAGE_EXTENSIONS.includes(fileExtension)) {
                throw new Error(`Invalid image format. Allowed formats: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`);
            }
            return true;
        },),

    // Kiểm tra array định dạng của ảnh [jpeg, png, jpg, gif] 
    validateFiles('images', ALLOWED_IMAGE_EXTENSIONS),

    // Kiểm tra array định dạng của video [mp4, avi, mkv, mov, webm]
    validateFiles('videos', ALLOWED_VIDEO_EXTENSIONS),

    // Kiểm tra xem genres có ít nhất 1 phần tử không
    body('genres')
        .isArray().withMessage('Genres must be an array')
        .custom(value => {
            if (value.length < 1) {
                throw new Error('Genres must have at least 1 item');
            }
            return true;
        }),

    // Kiểm tra xem tags có ít nhất 3 phần tử không
    body('tags')
        .isArray().withMessage('Tags must be an array')
        .custom(value => {
            if (value.length < 3) {
                throw new Error('Tags must have at least 5 items');
            }
            return true;
        }),

    // Kiểm tra xem features có ít nhất 1 phần tử không
    body('features')
        .isArray().withMessage('Features must be an array')
        .custom(value => {
            if (value.length < 1) {
                throw new Error('Features must have at least 1 item');
            }
            return true;
        }),

    // Thêm custom validation để xử lý lỗi trả về
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    productValidation,
};
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

    // Kiểm tra xem ngày bắt đầu giảm giá có hợp lệ không
    body('discountStartDate')
        .not().isEmpty().withMessage('Discount start date is required')
        .isISO8601().withMessage('Invalid date format'),

    // Kiểm tra xem ngày kết thúc giảm giá có hợp lệ không
    body('discountEndDate')
        .not().isEmpty().withMessage('Discount end date is required')
        .isISO8601().withMessage('Invalid date format'),

    // Kiểm tra xem ngày phát hành có hợp lệ không
    body('releaseDate')
        .not().isEmpty().withMessage('Release date is required')
        .isISO8601().withMessage('Invalid date format'),

    body('developer').not().isEmpty().withMessage('Developer is required'),
    body('publisher').not().isEmpty().withMessage('Publisher is required'),
    body('platform').not().isEmpty().withMessage('Platform is required'),

    // Kiểm tra xem rating có phải là số không
    body('rating')
        .not().isEmpty().withMessage('Rating is required')
        .isFloat({ min: 0, max: 5 }).withMessage('Rating must be a number between 0 and 5'),

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

    // Kiểm tra xem genres có phải là mảng không
    body('genres')
        .isArray().withMessage('Genres must be an array'),

    // Kiểm tra xem tags có phải là mảng không
    body('tags')
        .isArray().withMessage('Tags must be an array'),

    // Kiểm tra xem features có phải là mảng không
    body('features')
        .isArray().withMessage('Features must be an array'),

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
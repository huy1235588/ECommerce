const path = require('path');
const { body, validationResult } = require('express-validator');
const Product = require('../models/productModel');

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];

// Hàm kiểm tra định dạng file
const isValidFileExtension = (fileUrl, allowedExtensions) => {
    try {
        const urlPath = new URL(fileUrl).pathname;
        const fileExtension = path.extname(urlPath).toLowerCase();
        return allowedExtensions.includes(fileExtension);
    } catch {
        return false;
    }
};

const validateFiles = (field, allowedExtensions) => {
    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
    return body(field)
        .isArray({ min: 1 }).withMessage(`${capitalize(field)} is required`)
        .custom(files => {
            return files.every((file, index) => {
                // Kiểm tra định dạng của file
                if (!isValidFileExtension(file, allowedExtensions)) {
                    throw new Error(`Invalid ${field} format at index ${index}. Allowed formats: ${allowedExtensions.join(', ')}`);
                }
                return true;
            });
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
    body('discountEndDate')
        .custom((value, { req }) => {
            if (req.body.discount > 0) {
                // Kiểm tra ngày bắt đầu giảm giá có tồn tại không
                if (!value) {
                    throw new Error('Discount end date is required');
                }
                // Kiểm tra định dạng ngày
                else if (!new Date(value).toISOString()) {
                    throw new Error('Invalid date format');
                }

                // Kiểm tra ngày kết thúc giảm giá phải lớn hơn ngày hiện tại
                else if (new Date(value) < new Date()) {
                    throw new Error('Discount end date must be greater than current date');
                }
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

    // Kiểm tra array định dạng của ảnh [jpeg, png, jpg, gif] 
    validateFiles('screenshots', ALLOWED_IMAGE_EXTENSIONS),

    // Kiểm tra array định dạng của video [mp4, avi, mkv, mov, webm]
    body('videos')
        .custom(files => {
            return files.every((file, index) => {
                // Kiểm tra xem field có phải là videos không
                const { mp4, webm, thumbnail } = file;

                // Kiểm tra xem mp4, webm, thumbnail có tồn tại không
                if (!mp4 || !webm || !thumbnail) {
                    throw new Error(`${field} at index ${index} must have mp4, webm, and thumbnail`);
                }

                // Kiểm tra định dạng của mp4, webm, thumbnail
                if (
                    !isValidFileExtension(mp4, ['.mp4']) ||
                    !isValidFileExtension(webm, ['.webm']) ||
                    !isValidFileExtension(thumbnail, ALLOWED_IMAGE_EXTENSIONS)
                ) {
                    throw new Error(`Invalid file format at index ${index}`);
                }
                return true;
            });
        }),

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
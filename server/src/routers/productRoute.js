const express = require('express');
const { productValidation } = require('../utils/validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/productModel');
const productController = require('../controllers/productController');

const router = express.Router();

// Cấu hình multer để upload ảnh sản phẩm
const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Please upload an image'));
        }

        cb(undefined, true);
    },
    storage: multer.diskStorage({
        destination: async (req, file, cb) => {
            const id = req.body.id;

            // Tìm sản phẩm theo id
            const product = await Product.findById(id);

            // Tạo thư mục lưu trữ ảnh sản phẩm
            const folderPath = `uploads/${product._id}/`;
            // Nếu thư mục không tồn tại thì tạo mới
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            cb(null, folderPath);
        },
        filename: (req, file, cb) => {
            const extension = path.extname(file.originalname);
            cb(null, `header${extension}`);
        }
    })
});

// Router thêm sản phẩm vào Database
router.post('/add',
    productValidation,
    productController.addProduct
);

// Router upload ảnh sản phẩm
router.post('/uploadImage',
    upload.single('image'),
    productController.uploadImage
);

// Router thêm sản phẩm từ file JSON
router.post('/addFromFile', productController.addProductFromFile);

// Router lấy tất cả sản phẩm
router.get('/all', productController.getProducts);

// Router lấy sản phẩm theo id
router.get('/:id', productController.getProductById);

// Router kiểm tra sản phẩm đã tồn tại chưa
router.get('/item/count', productController.getCountByColumn);

module.exports = router;
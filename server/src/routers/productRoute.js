const express = require('express');
const { addProduct, addProductDetailFromFile, getProducts, uploadProductHeaderImage, getCountByColumn, addProductFromFile } = require('../controllers/productController');
const { productValidation } = require('../utils/validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/productModel');

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
    addProduct
);

// Router thêm chi tiết sản phẩm từ file JSON
router.post('/add/detail', addProductDetailFromFile);

// Router upload ảnh sản phẩm
router.post('/uploadImage',
    upload.single('headerImage'),
    uploadProductHeaderImage
);

// Router thêm sản phẩm từ file JSON
router.post('/addFromFile', addProductFromFile);

// Router lấy tất cả sản phẩm
router.get('/all', getProducts);

// Router kiểm tra sản phẩm đã tồn tại chưa
router.get('/item/count', getCountByColumn);

module.exports = router;
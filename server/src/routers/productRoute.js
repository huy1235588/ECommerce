const express = require('express');
const { addProduct, getProducts, uploadProductHeaderImage } = require('../controllers/productController');
const { productValidation } = require('../utils/validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/productModel');

const router = express.Router();

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
            if(!fs.existsSync(folderPath)) {
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

router.post('/add',
    productValidation,
    addProduct
);

router.post('/uploadImage',
    upload.single('headerImage'),
    uploadProductHeaderImage
);

router.get('/all', getProducts);

module.exports = router;
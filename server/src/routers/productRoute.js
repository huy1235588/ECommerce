const express = require('express');
const { addProduct, getProducts } = require('../controllers/productController');
const { productValidation } = require('../utils/validator');

const router = express.Router();

router.post('/add', productValidation, addProduct);

router.get('/all', getProducts);

module.exports = router;
const Product = require("../models/productModel");

// Thêm sản phẩm
const addProduct = async (req, res) => {
    try {
        // Tạo một sản phẩm mới
        const product = new Product(req.body);

        // Lưu sản phẩm vào Database
        await product.save();

        res.status(201).json({
            message: "Product added successfully",
            id: product._id,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Upload ảnh sản phẩm
const uploadProductHeaderImage = async (req, res) => {
    try {
        // Kiểm tra xem người dùng đã upload ảnh chưa
        if (!req.file) {
            throw new Error('Please upload an image');
        }

        // Tìm sản phẩm theo id
        const product = await Product.findById(req.body.id);
        // Nếu không tìm thấy sản phẩm thì thông báo lỗi
        if (!product) {
            throw new Error('Product not found');
        }

        // Lưu ảnh vào Database
        product.headerImage = req.file.path;

        // Lưu sản phẩm
        await product.save();

        res.json({
            message: 'Image uploaded successfully',
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Lấy tất cả sản phẩm
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    addProduct,
    getProducts,
    uploadProductHeaderImage,
};
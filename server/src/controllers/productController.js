const Product = require("../models/productModel");

const addProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: "Product added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

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
};
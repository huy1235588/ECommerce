const Product = require("../models/productModel");
const getNextSequenceValue = require('../utils/autoIncrement');

class ProductService {
    // Lấy id tiếp theo
    async getNextSequence(name) {
        const ret = await AutoIncrementModel.findOneAndUpdate({ _id: name }, { $inc: { seq: 1 } }, { new: true });
        return ret.seq;
    }

    // Thêm sản phẩm
    async addProduct(data) {
        try {
            // Tạo id mới
            const productId = await getNextSequenceValue('productId');

            // Thêm id vào dữ liệu
            data.productId = productId;

            // Tạo mới sản phẩm
            const product = new Product({
                ...data,
            });

            // Lưu sản phẩm
            await product.save();
            return product;

        } catch (error) {
            throw error;
        }
    }

    // Thêm danh sách sản phẩm
    async addProducts(products) {
        // Số lượng sản phẩm mỗi lần thêm
        const BATCH_SIZE = 1000;

        try {
            for (let i = 0; i < products.length; i += BATCH_SIZE) {
                const batch = products.slice(i, i + BATCH_SIZE);
                await Product.insertMany(batch);

                console.log(`Products added successfully: ${batch.length} products`);
            }

        } catch (error) {
            throw error;
        }
    }

    // Thêm vào cột tuỳ chỉnh
    async addCustomColumn(productId, column, value) {
        try {
            const product = await Product
                .findOne({ appId: productId })
                .select(column);

            if (!product) {
                throw new Error('Sản phẩm không tồn tại!');
            }

            product[column].push(value);
            await product.save();

            return product;

        } catch (error) {
            throw error;
        }
    }

    // Lấy tất cả sản phẩm
    async getProducts() {
        try {
            const products = await Product.find();
            return products;

        } catch (error) {
            throw error;
        }
    }

    // Lấy sản phẩm theo id
    async getProductById(productId) {
        try {
            const product = await Product.findOne({ appId: productId });
            return product;

        } catch (error) {
            throw error;
        }
    }

    // Lấy sản phẩm theo cột
    async getProductsByColumn(column, value) {
        try {
            const products = await Product.findOne({ [column]: value });
            return products;

        } catch (error) {
            throw error;
        }
    }

    // Lấy số lượng sản phẩm theo cột
    async countProducts(column, value) {
        try {
            const count = await Product.countDocuments({ [column]: value });
            return count;

        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ProductService();
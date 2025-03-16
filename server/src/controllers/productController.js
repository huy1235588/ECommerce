const ProductService = require("../services/productService");
const { readDataFromJson } = require("../utils/interactJson");

class ProductController {
    // Thêm sản phẩm
    async addProduct(req, res) {
        try {
            // Lấy dữ liệu từ request
            const data = req.body;

            // Lưu sản phẩm vào Database
            const product = await ProductService.addProduct(data);

            res.status(201).json({
                message: "Product added successfully",
                id: product._id,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Upload ảnh sản phẩm
    async uploadImage(req, res) {
        try {
            // Kiểm tra xem người dùng đã upload ảnh chưa
            if (!req.file) {
                throw new Error('Please upload an image');
            }

            const { id } = req.body;

            // Lưu ảnh vào Database
            await ProductService.addCustomColumn(id, 'headerImage ', req.file.filename);

            res.json({
                message: 'Image uploaded successfully',
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Thêm sản phẩm từ file JSON
    async addProductFromFile(req, res) {
        try {
            const {
                jsonId,
                errorIds,
            } = req.body;

            // Kiểm tra xem người dùng đã nhập đúng các trường cần thiết chưa
            if (!jsonId || !errorIds) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Đọc dữ liệu từ tệp JSON
            const folder = `json/data-${jsonId}`;

            // Đọc dữ liệu từ tệp JSON
            const productData = readDataFromJson(`${folder}/data.json`);

            // Kiểm tra xem dữ liệu có tồn tại không
            if (!productData) {
                return res.status(400).json({ error: 'Data not found' });
            }

            // Thêm sản phẩm vào Database
            await ProductService.addProducts(productData);

            // Trả về kết quả
            res.status(201).json({
                success: true,
                message: "Products added successfully",
                errorIds,
            });
        }
        catch (error) {
            if (error.name === "ValidationError") {
                console.log(error.errors);
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }

    // Lấy tất cả sản phẩm
    async getProducts(req, res) {
        try {
            const products = await ProductService.getProducts();

            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Lấy sản phẩm theo id
    async getProductById(req, res) {
        try {
            const { id } = req.params;

            const product = await ProductService.getProductById(id);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Đếm số lượng sản phẩm theo cột
    async getCountByColumn(req, res) {
        try {
            const { column, value } = req.query;

            if (!column || !value) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const count = await ProductService.countProducts(column, value);

            res.json(count);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new ProductController();
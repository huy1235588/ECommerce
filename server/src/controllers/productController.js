const { default: mongoose } = require("mongoose");
const Product = require("../models/productModel");
const { readDataFromJson } = require("../utils/interactJson");
const Achievement = require("../models/achievementModel");
const Language = require("../models/languageModel");
const AutoIncrementModel = mongoose.connection.collection('counters'); // Bảng của mongoose-sequence

// Hàm lấy id tiếp theo
async function getNextId() {
    const result = await AutoIncrementModel.findOneAndUpdate(
        { id: 'product_seq' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return result.seq;
}

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

// Thêm sản phẩm từ file JSON
const addProductFromFile = async (req, res) => {
    try {
        const {
            jsonId,
            errorIds,
            errorIdsAchievement
        } = req.body;

        // Kiểm tra xem người dùng đã nhập đúng các trường cần thiết chưa
        if (!jsonId || !errorIds || !errorIdsAchievement) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Đọc dữ liệu từ tệp JSON
        const folder = `json/data-${jsonId}`;

        const counterData = 3;

        for (let i = 0; i <= counterData; i++) {
            // Đọc dữ liệu từ tệp JSON
            const productData = readDataFromJson(`${folder}/data${i}.json`);
            const achievementData = readDataFromJson(`${folder}/achievement${i}.json`);
            const languageData = readDataFromJson(`${folder}/language${i}.json`);

            // Lọc ra các sản phẩm hợp lệ
            const validProducts = productData.filter(product => product.title !== null);

            // Cập nhật achievementData từ validProducts
            errorIdsAchievement.forEach(errorId => {
                const productAchievement = validProducts.find(item => item.id === errorId);
                const achievement = achievementData.find(item => item.id === errorId);

                if (productAchievement && productAchievement.title && achievement) {
                    achievement.title = productAchievement.title;
                }
            });

            // Thêm id cho sản phẩm
            const productsWithId = await Promise.all(
                validProducts.map(async product => ({
                    ...product,
                    _id: await getNextId(),
                }))
            );

            // Thêm sản phẩm vào Database
            const productModels = productsWithId.map(product => new Product(product));
            const achievementModels = productModels.map((product, i) =>
                new Achievement({
                    productId: product._id,
                    achievements: achievementData[i]?.achievement || [],
                })
            );
            const languageModels = productModels.map((product, i) =>
                new Language({
                    productId: product._id,
                    languages: languageData[i]?.languages || [],
                })
            );

            // Batch insert
            await Product.bulkWrite(productModels.map(doc => ({ insertOne: { document: doc } })));
            await Achievement.bulkWrite(achievementModels.map(doc => ({ insertOne: { document: doc } })));
            await Language.bulkWrite(languageModels.map(doc => ({ insertOne: { document: doc } })));

            // Thông báo thành công
            console.log(`Products added successfully: ${productsWithId.length} products`);
        }

        // Trả về kết quả
        res.status(201).json({
            message: "Products added successfully",
        });
    }
    catch (error) {
        if (error.name === "ValidationError") {
            console.log(error.errors);
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({ error: error.message });
    }
};

// Thêm chi tiết sản phẩm từ file JSON vào Database
const addProductDetailFromFile = async (req, res) => {
    try {
        const { jsonId, errorIds } = req.body;

        if (!jsonId || !errorIds) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const data = readDataFromJson(`json/data-detail-${jsonId}.json`);

        const products = data;

        products.forEach(async product => {
            const result = await Product.updateOne(
                { title: product.title },
                { $set: { detail: product.detail } }
            );

            console.log(`Updated ${result.matchedCount} product(s) with title ${product.title}`);
        });

        res.status(201).json({
            message: "Products updated successfully",
            errorIds,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            console.log(error.errors);
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({ error: error.message });
    }
};

// Lấy tất cả sản phẩm
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Đếm số lượng sản phẩm theo cột
const getCountByColumn = async (req, res) => {
    try {
        const { column, value } = req.query;

        if (!column || !value) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const count = await Product.countDocuments({ [column]: value });

        res.json(count);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addProduct,
    addProductFromFile,
    addProductDetailFromFile,
    getProducts,
    uploadProductHeaderImage,
    getCountByColumn,
};
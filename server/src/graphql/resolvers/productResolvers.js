const Product = require("../../models/productModel");

const productResolver = {
    Query: {
        // Hàm này trả về tất cả các sản phẩm
        products: async () => {
            return await Product.find();
        },

        // Hàm này trả về một sản phẩm dựa vào id
        product: async (_, { id }) => {
            return await Product.findById(id);
        },

        // Hàm này trả về một danh sách sản phẩm dựa vào các điều kiện lọc
        filterProducts: async (_, args) => {
            const { limit, ...filters } = args;
            let query = Product.find(filters);
            if (limit) {
                query = query.limit(limit);
            }
            return await query;
        },

        // Hàm này dùng để phân trang
        paginatedProducts: async (_, { page, limit }) => {
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const results = {};

            // Kiểm tra xem có trang kế tiếp hay không
            if (endIndex < (await Product.countDocuments().exec())) {
                results.next = {
                    page: page + 1,
                    limit: limit,
                };
            }

            // Kiểm tra xem có trang trước đó hay không
            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit: limit,
                };
            }

            results.products = await Product.find().limit(limit).skip(startIndex);
            results.totalProducts = await Product.countDocuments().exec();
            return results;
        },
    },
    Mutation: {
        createProduct: async (_, { input }) => {
            const product = new Product(input);
            return await product.save();
        },
        updateProduct: async (_, { id, input }) => {
            return await Product.findByIdAndUpdate(id, input, { new: true });
        },
    },
};

module.exports = productResolver;

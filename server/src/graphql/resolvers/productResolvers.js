const Product = require("../../models/productModel");

const productResolver = {
    Query: {
        // Hàm này trả về tất cả các sản phẩm
        products: async () => {
            return await Product.find();
        },

        // Hàm này trả về một sản phẩm dựa vào id
        product: async (_, { id, slice = '{}' }) => {
            // Parse JSON string thành object
            const sliceObj = JSON.parse(slice);

            // Lấy thông tin sản phẩm dựa vào id
            const product = await Product.findById(id)
                .populate('tags')
                .populate('screenshots')
                .populate('movies')
                .populate({
                    path: 'achievements',
                    options: {
                        // Giới hạn mảng highlighted trong achievements
                        select: {
                            'highlighted': {
                                $slice: sliceObj.achievements.highlighted.limit
                            }
                        }
                    }
                }).populate('package_groups')
                .populate('pc_requirements')
                .populate('mac_requirements')
                .populate('linux_requirements')
                .exec();

            return product;
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
        paginatedProducts: async (_,
            {
                page,
                limit,
                sortColumn = 'productId',
                sortOrder = 'asc',
                query = '{}',
                slice = '{}'
            }
        ) => {
            const filters = query ? JSON.parse(query) : {};
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            // Tạo một object chứa kết quả phân trang
            const [totalProducts, products] = await Promise.all([
                Product.countDocuments(filters),
                Product.find(filters)
                    .populate('tags')
                    .populate('screenshots')
                    .populate('movies')
                    .populate('achievements')
                    .populate('package_groups')
                    .populate('pc_requirements')
                    .populate('mac_requirements')
                    .populate('linux_requirements')
                    .sort({ [sortColumn]: sortOrder })
                    .skip(startIndex)
                    .limit(limit)
                    .select(JSON.parse(slice))
                    .exec()
            ]);

            // Kết quả phân trang
            const results = {
                totalProducts,
                products,
                previous: null,
                next: null
            };

            // Kiểm tra xem có trang tiếp theo hay không
            if (endIndex < totalProducts) {
                results.next = {
                    page: page + 1,
                    limit
                };
            }

            // Kiểm tra xem có trang trước đó hay không
            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit: limit,
                };
            }

            return results;
        },
    },
    Mutation: {
        // Hàm này dùng để cập nhật thông tin sản phẩm
        UpdateProduct: async (_, args) => {
            const { productId, ...data } = args;
            return await Product.findOneAndUpdate(
                { productId },
                { $set: data },
                { new: true }
            );
        },
    },
};

module.exports = productResolver;

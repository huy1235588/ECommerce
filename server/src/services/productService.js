const Product = require("../models/productModel");
const Screenshot = require("../models/screenshotModel");
const Movie = require("../models/movieModel");
const Achievement = require("../models/achievementModel");
const PackageGroup = require("../models/packageGroupModel");
const Requirement = require("../models/requirementModel");
const Tag = require("../models/tagModel");

class ProductService {
    // Thêm sản phẩm
    async addProduct(data) {
        try {
            // Tạo mới sản phẩm
            const product = new Product({
                name: data.name,
                type: data.type,
                dlc: data.dlc,

                short_description: data.short_description,
                detailed_description: data.detailed_description,
                about_the_game: data.about_the_game,
                supported_languages: data.supported_languages,
                reviews: data.reviews,

                header_image: data.header_image,
                capsule_image: data.capsule_image,
                background: data.background,
                background_raw: data.background_raw,

                developers: data.developers,
                publishers: data.publishers,

                price_overview: data.price_overview,
                packages: data.packages,
                platforms: data.platforms,

                categories: data.categories,
                genres: data.genres,

                release_date: data.release_date,
            });

            // Lưu sản phẩm
            await product.save();

            // Lưu tags
            if (data.tags) {
                const tags = Object.entries(data.tags).map(([name, id]) => new Tag({
                    productId: product._id,
                    id: id, // Value của object tags
                    name: name // Key của object tags
                }));
                await Tag.insertMany(tags);
                product.tags = tags.map(t => t._id);
            }

            // Lưu screenshots
            if (data.screenshots) {
                const screenshots = data.screenshots.map(screenshot => new Screenshot({
                    productId: product._id,
                    id: screenshot.id,
                    path_thumbnail: screenshot.path_thumbnail,
                    path_full: screenshot.path_full
                }));
                await Screenshot.insertMany(screenshots);
                product.screenshots = screenshots.map(s => s._id);
            }

            // Lưu movies
            if (data.movies) {
                const movies = data.movies.map(movie => new Movie({
                    productId: product._id,
                    id: movie.id,
                    name: movie.name,
                    thumbnail: movie.thumbnail,
                    webm: movie.webm,
                    mp4: movie.mp4,
                    highlight: movie.highlight
                }));
                await Movie.insertMany(movies);
                product.movies = movies.map(m => m._id);
            }

            // Lưu achievements
            if (data.achievements) {
                const achievement = new Achievement({
                    productId: product._id,
                    total: data.achievements.total,
                    highlighted: data.achievements.highlighted
                });
                await achievement.save();
                product.achievements = achievement._id;
            } else {
                product.achievements = null;
            }

            // Lưu package_groups
            if (data.package_groups[0]) {
                const packageGroups = new PackageGroup({
                    productId: product._id,
                    name: data.package_groups[0].name,
                    title: data.package_groups[0].title,
                    description: data.package_groups[0].description,
                    selection_text: data.package_groups[0].selection_text,
                    save_text: data.package_groups[0].save_text,
                    display_type: data.package_groups[0].display_type,
                    is_recurring_subscription: data.package_groups[0].is_recurring_subscription,
                    subs: data.package_groups[0].subs.map(sub => ({
                        packageId: sub.packageid,
                        percent_savings_text: sub.percent_savings_text,
                        percent_savings: sub.percent_savings,
                        option_text: sub.option_text,
                        option_description: sub.option_description,
                        can_get_free_license: sub.can_get_free_license,
                        is_free_license: sub.is_free_license,
                        price_in_cents_with_discount: sub.price_in_cents_with_discount
                    }))
                });
                await packageGroups.save();
                product.package_groups = packageGroups._id;
            }

            // Lưu requirements
            const requirements = [
                {
                    type: 'pc',
                    minimum: data.pc_requirements.minimum,
                    recommended: data.pc_requirements.recommended
                },
                {
                    type: 'mac',
                    minimum: data.mac_requirements.minimum,
                    recommended: data.mac_requirements.recommended
                },
                {
                    type: 'linux',
                    minimum: data.linux_requirements.minimum,
                    recommended: data.linux_requirements.recommended
                }
            ].filter(req => req.minimum || req.recommended);

            // Lưu requirements
            const savedRequirements = await Requirement.insertMany(requirements.map(req => ({
                productId: product._id,
                ...req
            })));
            product.pc_requirements = savedRequirements.find(req => req.type === 'pc')._id;
            product.mac_requirements = savedRequirements.find(req => req.type === 'mac')?._id;
            product.linux_requirements = savedRequirements.find(req => req.type === 'linux')?._id;

            // Cập nhật sản phẩm với các references
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
                // Thêm từng lô sản phẩm
                const batch = products.slice(i, i + BATCH_SIZE);

                // Thêm sản phẩm vào Database
                for (const product of batch) {
                    await this.addProduct(product);
                }

                console.log(`Products added successfully: ${batch.length} products`);
            }

        } catch (error) {
            console.log(error);
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

            if (product[column].includes(value)) {
                throw new Error('Giá trị đã tồn tại!');
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
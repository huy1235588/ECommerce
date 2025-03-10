const Product = require("../models/productModel");
class ProductService {
    // Thêm sản phẩm
    async addProduct(data) {
        try {
            // Tạo mới sản phẩm
            const product = new Product({
                type: data.type,
                name: data.name,
                required_age: data.required_age,
                is_free: data.is_free,
                controller_support: data.controller_support,
                dlc: data.dlc,
                detailed_description: data.detailed_description,
                about_the_game: data.about_the_game,
                short_description: data.short_description,
                supported_languages: data.supported_languages,
                reviews: data.reviews,
                header_image: data.header_image,
                capsule_image: data.capsule_image,
                capsule_imagev5: data.capsule_imagev5,
                legal_notice: data.legal_notice,
                developers: data.developers,
                publishers: data.publishers,
                price_overview: data.price_overview,
                packages: data.packages,
                platforms: data.platforms,
                categories: data.categories,
                genres: data.genres,
                release_date: data.release_date,
                background: data.background,
                background_raw: data.background_raw
            });

            // Lưu screenshots
            const screenshots = data.screenshots.map(screenshot => new Screenshot({
                game_id: game._id,
                id: screenshot.id,
                path_thumbnail: screenshot.path_thumbnail,
                path_full: screenshot.path_full
            }));
            await Screenshot.insertMany(screenshots);
            game.screenshots = screenshots.map(s => s._id);

            // Lưu movies
            const movies = gameData.movies.map(movie => new Movie({
                game_id: game._id,
                id: movie.id,
                name: movie.name,
                thumbnail: movie.thumbnail,
                webm: movie.webm,
                mp4: movie.mp4,
                highlight: movie.highlight
            }));
            await Movie.insertMany(movies);
            game.movies = movies.map(m => m._id);

            // Lưu achievements
            const achievement = new Achievement({
                game_id: game._id,
                total: gameData.achievements.total,
                highlighted: gameData.achievements.highlighted
            });
            await achievement.save();
            game.achievements = achievement._id;

            // Lưu package_groups
            const packageGroups = gameData.package_groups.map(pg => new PackageGroup({
                game_id: game._id,
                name: pg.name,
                title: pg.title,
                description: pg.description,
                selection_text: pg.selection_text,
                save_text: pg.save_text,
                display_type: pg.display_type,
                is_recurring_subscription: pg.is_recurring_subscription,
                subs: pg.subs
            }));
            await PackageGroup.insertMany(packageGroups);
            game.package_groups = packageGroups.map(pg => pg._id);

            // Lưu requirements
            const pcReq = new Requirement({
                game_id: game._id,
                type: 'pc',
                minimum: gameData.pc_requirements.minimum,
                recommended: gameData.pc_requirements.recommended
            });
            await pcReq.save();
            game.pc_requirements = pcReq._id;

            const macReq = new Requirement({
                game_id: game._id,
                type: 'mac',
                minimum: gameData.mac_requirements.minimum,
                recommended: gameData.mac_requirements.recommended
            });
            await macReq.save();
            game.mac_requirements = macReq._id;

            const linuxReq = new Requirement({
                game_id: game._id,
                type: 'linux',
                minimum: gameData.linux_requirements.minimum,
                recommended: gameData.linux_requirements.recommended
            });
            await linuxReq.save();
            game.linux_requirements = linuxReq._id;

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
                // Thêm từng lô sản phẩm
                const batch = products.slice(i, i + BATCH_SIZE);

                // Thêm sản phẩm vào Database
                await Promise.all(batch.map(async product => {
                    await this.addProduct(product);
                }));

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
const Achievement = require("../../models/achievementModel");

const achievementResolvers = {
    Query: {
        getAchievementList: async () => {
            return await Achievement
                .find()
        },
        getAchievement: async (_, { productId, slice}) => {
            return await Achievement
                .findOne({ productId })
                .select(slice ? { achievements: { $slice: slice } } : {})
        },
        paginatedAchievements: async (_, { 
            page, 
            limit, 
            query = '{}', 
            slice = '{}'
         }) => {
            const filters = query ? JSON.parse(query) : {};
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const [totalAchievements, achievements] = await Promise.all([
                Achievement.countDocuments(filters),
                Achievement.find(filters)
                    .skip(startIndex)
                    .limit(limit)
                    .select(JSON.parse(slice))
                    .exec()
            ]);

            // Kết quả phân trang
            const results = {
                totalAchievements,
                achievements,
                previous: null,
                next: null
            };

            // Trang tiếp theo
            if (endIndex < totalAchievements) {
                results.next = {
                    page: page + 1,
                    limit
                };
            }

            // Trang trước
            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit
                };
            }

            return results;
        }
    },
    Mutation: {
        createAchievement: async (_, { productId, title, description, percent, image }) => {
            const achievement = { title, description, percent, image };
            return await Achievement.findOneAndUpdate(
                { productId },
                { $push: { achievements: achievement } },
                { new: true, upsert: true }
            );
        },
        updateAchievement: async (_, { productId, title, description, percent, image }) => {
            const achievement = { title, description, percent, image };
            return await Achievement.findOneAndUpdate(
                { productId, "achievements.title": title },
                { $set: { "achievements.$": achievement } },
                { new: true }
            );
        },
        deleteAchievement: async (_, { productId, title }) => {
            return await Achievement.findOneAndUpdate(
                { productId },
                { $pull: { achievements: { title } } },
                { new: true }
            );
        }
    }
};

module.exports = achievementResolvers;
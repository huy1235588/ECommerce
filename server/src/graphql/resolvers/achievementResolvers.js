const Achievement = require("../../models/achievementModel");

const achievementResolvers = {
    Query: {
        // Trả về một achievement dựa vào productId
        achievement: async (_, { productId }) => {
            return await Achievement.findOne({
                productId: productId
            });
        },

        // Trả về tất cả achievements
        achievements: async () => {
            return await Achievement.find();
        }
    },

    Mutation: {
        // Cập nhật một achievement
        UpdateAchievement: async (_, args) => {
            const { productId, total, highlighted } = args;
            const achievement = await Achievement.updateOne({
                productId: productId
            }, {
                total: total,
                highlighted: highlighted
            });
            return achievement;
        }
    }
};

module.exports = achievementResolvers;
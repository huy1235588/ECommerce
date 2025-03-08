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
        getLimitedAchievementList: async (_, { limit }) => {
            return await Achievement
                .find().limit(limit)
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
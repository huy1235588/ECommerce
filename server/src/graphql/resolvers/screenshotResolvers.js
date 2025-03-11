const Screenshot = require('../../models/screenshotModel');

const screenshotResolvers = {
    Query: {
        // Trả về một screenshot dựa vào id
        screenshot: async (_, { id }) => {
            return await Screenshot.findById(id);
        },

        // Trả về tất cả screenshots
        screenshots: async () => {
            return await Screenshot.findById(id);
        },
    },
    Mutation: {
     
    }
};

module.exports = screenshotResolvers;
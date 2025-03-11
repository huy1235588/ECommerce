const Tag = require('../../models/tagModel');

const tagResolvers = {
    Query: {
        // Truy vấn tag theo productId
        tag: async (_, { productId }) => {
            return await Tag.find({ productId });
        },

        // Truy vấn tất cả tag
        tags: async () => {
            return await Tag.find();
        },
    },
    Mutation: {
        // Cập nhật tag
        updateTag: async (_, { id, input }) => {
            return await Tag.findByIdAndUpdate(id, input, { new: true });
        }
    }
}

module.exports = tagResolvers;
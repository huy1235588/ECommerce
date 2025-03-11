const PackageGroup = require('../../models/packageGroupModel');

const packageGroupResolvers = {
    Query: {
        // Trả về một packageGroup dựa trên productId
        packageGroup: async (_, { productId }) => {
            return await PackageGroup.findOne({ productId });
        },

        // Trả về tất cả packageGroup
        packageGroups: async () => {
            return await PackageGroup.find();
        }
    },

    Mutation: {
        // Cập nhật một packageGroup
        updatePackageGroup: async (_, { packageGroup }) => {
            try {
                const { productId } = packageGroup;
                const updatedPackageGroup = await Package
                    .findOneAndUpdate({ productId }, packageGroup, { new: true });

                return updatedPackageGroup;

            } catch (error) {
                throw error;
            }
        }
    }
};

module.exports = packageGroupResolvers;
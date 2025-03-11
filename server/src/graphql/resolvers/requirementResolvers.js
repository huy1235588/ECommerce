const Requirement = require('../../models/requirementModel');

const requirementResolvers = {
    Query: {
        // Lấy requirement theo productId
        requirement: async (_, { productId }) => {
            return Requirement.find({ productId });
        },

        // Lấy tất cả requirements
        requirements: async () => {
            return Requirement.find();
        },
    },
    Mutation: {
        updateRequirement: async (_, {
            productId,
            requirement
        }, {
            models
        }) => {
            return models.Requirement.findOneAndUpdate({
                productId
            }, requirement, {
                new: true
            });
        }
    }
};

module.exports = requirementResolvers;
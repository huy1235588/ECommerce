const achievementResolvers = require('./resolvers/achievementResolvers');
const productResolvers = require('./resolvers/productResolvers');

// Export a single merged object instead of an array
const resolvers = {
    Query: {
        ...productResolvers.Query,
        ...achievementResolvers.Query,
    },
    Mutation: {
        ...productResolvers.Mutation,
        ...achievementResolvers.Mutation,
    }
};

module.exports = resolvers;
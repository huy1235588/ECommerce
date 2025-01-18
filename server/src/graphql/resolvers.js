const achievementResolvers = require('./resolvers/achievementResolvers');
const languageResolvers = require('./resolvers/languageResolvers');
const productResolvers = require('./resolvers/productResolvers');

// Export a single merged object instead of an array
const resolvers = {
    Query: {
        ...productResolvers.Query,
        ...achievementResolvers.Query,
        ...languageResolvers.Query
    },
    Mutation: {
        ...productResolvers.Mutation,
        ...achievementResolvers.Mutation,
        ...languageResolvers.Mutation
    }
};

module.exports = resolvers;
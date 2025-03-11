const productResolvers = require('./resolvers/productResolvers');

// Export a single merged object instead of an array
const resolvers = {
    Query: {
        ...productResolvers.Query,
    },
    Mutation: {
        ...productResolvers.Mutation,
    }
};

module.exports = resolvers;
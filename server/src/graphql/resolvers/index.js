const productResolvers = require('./productResolvers');

// Export a single merged object instead of an array
module.exports = {
    Query: {
        ...productResolvers.Query
    },
    Mutation: {
        ...productResolvers.Mutation
    }
};
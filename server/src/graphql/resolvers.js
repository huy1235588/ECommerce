const achievementResolvers = require('./resolvers/achievementResolvers');
const movieResolvers = require('./resolvers/movieResolvers');
const productResolvers = require('./resolvers/productResolvers');
const requirementResolvers = require('./resolvers/requirementResolvers');
const screenshotResolvers = require('./resolvers/screenshotResolvers');

// Export a single merged object instead of an array
const resolvers = {
    Query: {
        ...productResolvers.Query,
        ...achievementResolvers.Query,
        ...movieResolvers.Query,
        ...requirementResolvers.Query,
        ...screenshotResolvers.Query,
    },
    Mutation: {
        ...productResolvers.Mutation,
        ...achievementResolvers.Mutation,
        ...movieResolvers.Mutation,
        ...requirementResolvers.Mutation,
        ...screenshotResolvers.Mutation,
    }
};

module.exports = resolvers;
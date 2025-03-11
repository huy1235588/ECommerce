const achievementResolvers = require('./resolvers/achievementResolvers');
const movieResolvers = require('./resolvers/movieResolvers');
const packageGroupResolvers = require('./resolvers/packageGroupResolvers');
const productResolvers = require('./resolvers/productResolvers');
const requirementResolvers = require('./resolvers/requirementResolvers');
const screenshotResolvers = require('./resolvers/screenshotResolvers');
const tagResolvers = require('./resolvers/tagResolvers');

// Export a single merged object instead of an array
const resolvers = {
    Query: {
        ...productResolvers.Query,
        ...achievementResolvers.Query,
        ...movieResolvers.Query,
        ...requirementResolvers.Query,
        ...screenshotResolvers.Query,
        ...packageGroupResolvers.Query,
        ...tagResolvers.Query,
    },
    Mutation: {
        ...productResolvers.Mutation,
        ...achievementResolvers.Mutation,
        ...movieResolvers.Mutation,
        ...requirementResolvers.Mutation,
        ...screenshotResolvers.Mutation,
        ...packageGroupResolvers.Mutation,
        ...tagResolvers.Mutation,
    }
};

module.exports = resolvers;
const { gql } = require('graphql-tag');
const productSchema = require('./schema/productSchema');
const { achievementType, achievementSchema } = require('./schema/achievementSchema');

const typeDefs = gql`
    ${achievementSchema}
    ${productSchema}
`;

module.exports = typeDefs;
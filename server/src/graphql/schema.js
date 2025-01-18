const { gql } = require('graphql-tag');
const { default: productSchema } = require('./schema/productSchema');
const achievementSchema = require('./schema/achievementSchema');
const languageSchema = require('./schema/languageSchema');

const typeDefs = gql`
    ${productSchema}
    ${achievementSchema}
    ${languageSchema}
`;

module.exports = typeDefs;
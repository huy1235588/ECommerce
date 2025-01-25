const { gql } = require('graphql-tag');
const achievementSchema = require('./schema/achievementSchema');
const languageSchema = require('./schema/languageSchema');
const productSchema = require('./schema/productSchema');

const typeDefs = gql`
    ${productSchema}
    ${achievementSchema}
    ${languageSchema}
`;

module.exports = typeDefs;
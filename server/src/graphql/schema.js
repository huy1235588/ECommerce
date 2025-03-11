const { gql } = require('graphql-tag');
const productSchema = require('./schema/productSchema');

const typeDefs = gql`
    ${productSchema}
`;

module.exports = typeDefs;
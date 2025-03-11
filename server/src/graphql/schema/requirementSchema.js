const requirementSchema = `
    type Requirement {
        productId: Int!
        type: String!
        minimum: String
        recommended: String
    }

    # Truy vấn
    type Query {
        requirements: [Requirement]
        requirement(productId: Int!): [Requirement]
    }
        
    # Mutation
    input RequirementInput {
        productId: Int!
        type: String!
        minimum: String
        recommended: String
    }

    type Mutation {
        updateRequirement(productId: Int!, requirement: RequirementInput): Requirement
    }
`;

module.exports = requirementSchema;
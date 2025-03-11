const tagSchema = `
    type Tag {
        productId: Int
        id: Int
        name: String
    }

    # Queries
    type Query {
        tag(productId: Int!): [Tag]
        tags: [Tag]
    }

    # Mutation Input
    input TagInput {
        productId: Int!
        id: Int
        name: String
    }

    type Mutation {
        updateTag(id: ID!, input: TagInput): Tag
    }
`

module.exports = tagSchema;
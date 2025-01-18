const productSchema = `
type Video {
    mp4: String!
    webm: String
    thumbnail: String!
}

type SystemRequirement {
    title: String
    minimum: String
    recommended: String
}

type Requirements {
    win: [SystemRequirement]
    mac: [SystemRequirement]
    linux: [SystemRequirement]
}

type Product {
    _id: Int!
    title: String!
    type: String!
    description: String
    detail: String
    price: Float!
    discount: Float
    discountStartDate: String
    discountEndDate: String
    releaseDate: String
    developer: [String]!
    publisher: [String]!
    platform: [String]!
    rating: Float
    isActive: Boolean!
    headerImage: String
    screenshots: [String]!
    videos: [Video]
    genres: [String]
    tags: [String]
    features: [String]
    systemRequirements: Requirements
    createdAt: String
    updatedAt: String
}

type Query {
    products: [Product]
    product(id: Int!): Product
    filterProducts(
        _id: Int
        title: String
        discountStartDate: String
        discountEndDate: String
        releaseDate: String
        developer: [String]
        publisher: [String]
        platform: [String]
        rating: Float
        isActive: Boolean
        genres: [String]
        tags: [String]
        features: [String]
        limit: Int
    ): [Product]
}

  input VideoInput {
    mp4: String!
    webm: String
    thumbnail: String!
}

  input SystemRequirementInput {
    title: String
    minimum: String
    recommended: String
}

  input RequirementsInput {
    win: [SystemRequirementInput]
    mac: [SystemRequirementInput]
    linux: [SystemRequirementInput]
}

  input ProductInput {
    title: String!
    type: String!
    description: String
    price: Float!
    discount: Float
    discountStartDate: String
    discountEndDate: String
    releaseDate: String
    developer: [String]!
    publisher: [String]!
    platform: [String]!
    rating: Float
    isActive: Boolean
    headerImage: String
    screenshots: [String]!
    videos: [VideoInput]
    genres: [String]
    tags: [String]
    features: [String]
    systemRequirements: RequirementsInput
}

type Mutation {
    createProduct(input: ProductInput!): Product
    updateProduct(id: Int!, input: ProductInput!): Product
    deleteProduct(id: Int!): Product
}
`;

export default productSchema;
const achievementSchema = require("./achievementSchema");
const movieSchema = require("./movieSchema");
const requirementSchema = require("./requirementSchema");
const screenshotSchema = require("./screenshotSchema");

const productSchema = `
${screenshotSchema}
${movieSchema}
${achievementSchema}
${requirementSchema}

type Product {
    _id: ID!
    name: String!
    type: String!
    dlc: [String]

    shortDescription: String
    detailedDescription: String
    aboutTheGame: String
    supportedLanguages: String
    reviews: String

    headerImage: String
    capsuleImage: String
    background: String
    backgroundRaw: String

    developers: [String]
    publishers: [String]

    priceOverview: PriceOverview
    packages: [Int]
    platform: Platform

    categories: [Category]
    genres: [Genre]
    releaseDate: ReleaseDate

    screenshots: [Screenshot]
    movies: [Movie]

    achievements: [Achievement]

    pc_requirements: Requirement
    mac_requirements: Requirement
    linux_requirements: Requirement
}

type PriceOverview {
    currency: String
    initial: Float
    final: Float
    discountPercent: Int
}

type Platform {
    windows: Boolean
    mac: Boolean
    linux: Boolean
}

type Category {
    id: Int
    description: String
}

type Genre {
    id: Int
    description: String
}

type ReleaseDate {
    comingSoon: Boolean
    date: String
}

# Truy vấn
type Query {
    # Lấy tất cả sản phẩm
    products: [Product]
    
    # Lấy sản phẩm theo ID
    product(id: Int!): Product
    
    # Lọc sản phẩm theo nhiều tiêu chí
    filterProducts(
        productId: Int
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
    paginatedProducts(page: Int!, limit: Int!, sortColumn: String, sortOrder: String, query: String, slice: String): PaginatedProducts  # Phân trang sản phẩm
}

# Kết quả phân trang
type PaginatedProducts {
    products: [Product]
    totalProducts: Int
    previous: Page
    next: Page
}

# Thông tin phân trang
type Page {
    page: Int
    limit: Int
}

# Cập nhật dữ liệu
type Mutation {
    # Cập nhật thông tin sản phẩm
    UpdateProduct(
        productId: Int!
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
    ): Product 
}
`;

module.exports = productSchema;
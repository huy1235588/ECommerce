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

    short_description: String
    detailed_description: String
    about_the_game: String
    supported_languages: String
    reviews: String

    header_image: String
    capsule_image: String
    background: String
    background_raw: String

    developers: [String]
    publishers: [String]

    price_overview: PriceOverview
    packages: [Int]
    platform: Platform

    categories: [Category]
    genres: [Genre]
    release_date: ReleaseDate

    screenshots: [Screenshot]
    movies: [Movie]

    achievements: [Achievement]

    pc_requirements: Requirement
    mac_requirements: Requirement
    linux_requirements: Requirement

    created_at: String
    updated_at: String
}

type PriceOverview {
    currency: String
    initial: Float
    final: Float
    discount_percent: Int
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
    coming_soon: Boolean
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
        product_id: Int
        title: String
        discount_start_date: String
        discount_end_date: String
        release_date: String
        developer: [String]
        publisher: [String]
        platform: [String]
        rating: Float
        is_active: Boolean
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
        product_id: Int!
        title: String
        discount_start_date: String
        discount_end_date: String
        release_date: String
        developer: [String]
        publisher: [String]
        platform: [String]
        rating: Float
        is_active: Boolean
        genres: [String]
        tags: [String]
        features: [String]
    ): Product 
}
`;

module.exports = productSchema;
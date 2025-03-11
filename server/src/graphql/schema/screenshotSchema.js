const screenshotSchema = `
    type Screenshot {
        productId: ID!
        id: ID!
        path_thumbnail: String!
        path_full: String!
    }

    # Truy vấn
    type Query {
        screenshot(id: ID!): Screenshot
        screenshots: [Screenshot]
    }

    # Mutation
    input ScreenshotInput {
        productId: ID!
        id: ID!
        path_thumbnail: String!
        path_full: String!
    }

    type Mutation {
        # Cập nhật 1 screenshot
        updateScreenshot(id: ID!, input: ScreenshotInput): Screenshot
    }

`

module.exports = screenshotSchema;
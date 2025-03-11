const achievementSchema = `
    type Highlighted {
        name: String
        path: String
    }

    type Achievement {
        productId: Int
        total: Int
        highlighted: [Highlighted]
    }

    # Truy vấn
    type Query {
        achievement(productId: Float!): Achievement
        achievements: [Achievement]
    }

    # Input cho mutation
    input HighlightedInput {
        name: String
        path: String
    }

    type Mutation {
        UpdateAchievement(productId: Float!, total: Int, highlighted: [HighlightedInput]): Achievement
    }
`;

module.exports = achievementSchema;
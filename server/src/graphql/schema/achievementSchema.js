const achievementType = `
    type Highlighted {
        name: String
        path: String
    }

    type Achievement {
        productId: Float!
        total: Int
        highlighted: [Highlighted]
    }
`;

const achievementSchema = `
    ${achievementType}
    
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

module.exports = {
    achievementSchema,
    achievementType
};
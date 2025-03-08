const achievementSchema = `
    type Achievement {
        title: String
        description: String
        percent: Float
        image: String
    }
    
    type AchievementList {
        productId: Int
        achievements: [Achievement]
    }
    
    type Query {
        getAchievementList: [AchievementList]
        getAchievement(productId: Int!, slice: Int): AchievementList
        getLimitedAchievementList(limit: Int!): [AchievementList]
    }
    
    type Mutation {
        createAchievement(productId: Int!, title: String, description: String, percent: Int, image: String): Achievement
        updateAchievement(productId: Int!, title: String, description: String, percent: Int, image: String): Achievement
        deleteAchievement(productId: Int!, title: String): Achievement
    }
`;

module.exports = achievementSchema;
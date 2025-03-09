const achievementSchema = `
    type Achievement {
        title: String
        description: String
        percent: Float
        image: String
    }
    
    type AchievementList {
        _id: ID
        productId: Int
        achievements: [Achievement]
    }
    
    type Query {
        getAchievementList: [AchievementList]
        getAchievement(productId: Int!, slice: Int): AchievementList
        paginatedAchievements(page: Int, limit: Int, query: String, slice: String): PaginatedAchievements
    }

    # Định nghĩa kiểu dữ liệu trả về khi phân trang
    type PaginatedAchievements {
        totalAchievements: Int
        achievements: [AchievementList]
        previous: Pagination
        next: Pagination
    }

    # Định nghĩa kiểu dữ liệu của phân trang
    type Pagination {
        page: Int
        limit: Int
    }

    # Định nghĩa các mutation
    type Mutation {
        createAchievement(productId: Int!, title: String, description: String, percent: Int, image: String): Achievement
        updateAchievement(productId: Int!, title: String, description: String, percent: Int, image: String): Achievement
        deleteAchievement(productId: Int!, title: String): Achievement
    }
`;

module.exports = achievementSchema;
const Achievement = require("../models/achievementModel");

class AchievementService {
    // Thêm thành tựu
    async addAchievement(data) {
        try {
            // Tạo mới thành tựu
            const achievement = new Achievement({
                ...data,
            });

            // Lưu thành tựu
            await achievement.save();
            return achievement;

        } catch (error) {
            throw error;
        }
    }

    // Thêm danh sách thành tựu
    async addAchievements(achievements) {
        // Số lượng thành tựu mỗi lần thêm
        const BATCH_SIZE = 1000;

        try {
            for (let i = 0; i < achievements.length; i += BATCH_SIZE) {
                const batch = achievements.slice(i, i + BATCH_SIZE);
                await Achievement.insertMany(batch);

                console.log(`Achievements added successfully: ${batch.length} achievements`);
            }

        } catch (error) {
            throw error;
        }
    }

    // Lấy tất cả thành tựu
    async getAchievements() {
        try {
            const achievements = await Achievement.find();
            return achievements;

        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AchievementService();
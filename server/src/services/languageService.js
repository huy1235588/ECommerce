const Language = require("../models/languageModel");

class LanguageService {
    // Thêm ngôn ngữ
    async addLanguage(data) {
        try {
            // Tạo mới ngôn ngữ
            const language = new Language({
                ...data,
            });

            // Lưu ngôn ngữ
            await language.save();
            return language;

        } catch (error) {
            throw error;
        }
    }

    // Thêm danh sách ngôn ngữ
    async addLanguages(languages) {
        // Số lượng ngôn ngữ mỗi lần thêm
        const BATCH_SIZE = 1000;

        try {
            for (let i = 0; i < languages.length; i += BATCH_SIZE) {
                const batch = languages.slice(i, i + BATCH_SIZE);
                await Language.insertMany(batch);

                console.log(`Languages added successfully: ${batch.length} languages`);
            }

        } catch (error) {
            throw error;
        }
    }

    // Lấy tất cả ngôn ngữ
    async getLanguages() {
        try {
            const languages = await Language.find();
            return languages;

        } catch (error) {
            throw error;
        }
    }
}

module.exports = new LanguageService();
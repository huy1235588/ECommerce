const axios = require('axios');
const fs = require('fs');
const { addDataToJson } = require('../utils/interactJson');

// Hàm delay để tạo khoảng nghỉ giữa các yêu cầu
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FetchApiService {
    // Đường dẫn API
    url = 'https://store.steampowered.com/api/appdetails';

    // Thời gian chờ giữa các lần gọi API
    delay = 1000;

    fetchApi = async (id) => {
        try {
            // Gọi API để lấy dữ liệu
            const response = await axios.get(`${this.url}?appids=${id}`);

            // Lấy dữ liệu từ phần data
            const gameData = response.data[id].data;

            // Lấy dữ liệu trả về
            const data = {
                appId: id,
                type: gameData.type,
                name: gameData.name,
                required_age: gameData.required_age,
                is_free: gameData.is_free,
                controller_support: gameData.controller_support,
                dlc: gameData.dlc,
                detailed_description: gameData.detailed_description,
                about_the_game: gameData.about_the_game,
                short_description: gameData.short_description,
                supported_languages: gameData.supported_languages,
                reviews: gameData.reviews,
                header_image: gameData.header_image,
                capsule_image: gameData.capsule_image,
                capsule_imagev5: gameData.capsule_imagev5,
                legal_notice: gameData.legal_notice,
                developers: gameData.developers,
                publishers: gameData.publishers,
                price_overview: gameData.price_overview,
                packages: gameData.packages,
                platforms: gameData.platforms,
                categories: gameData.categories,
                genres: gameData.genres,
                release_date: gameData.release_date,
                background: gameData.background,
                background_raw: gameData.background_raw,

                screenshots: gameData.screenshots,
                movies: gameData.movies,
                achievements: gameData.achievements,
                package_groups: gameData.package_groups,
                pc_requirements: gameData.pc_requirements,
                mac_requirements: gameData.mac_requirements,
                linux_requirements: gameData.linux_requirements,
            };

            return data;

        } catch (error) {
            if (error.response && error.response.status === 429 && retryCount < this.maxRetries) {
                // Xử lý lỗi 429: Too Many Requests
                const retryAfter = error.response.headers['retry-after']
                    ? parseInt(error.response.headers['retry-after']) * 1000
                    : Math.pow(2, retryCount) * this.baseDelay; // Exponential backoff
                console.log(`Rate limit hit for id ${id}. Retrying after ${retryAfter / 1000}s...`);
                await delay(retryAfter);
                return this.fetchApi(id, retryCount + 1);
            }

            console.error(`Error fetching data for id ${id}:`, error);
            throw error;
        }
    }

    // Hàm gọi API để lấy dữ liệu từ Steam
    fetchById = async (id) => {
        console.log(`Fetching data for id ${id}...`);

        // Lấy dữ liệu từ API
        const data = await this.fetchApi(id);

        // Thêm dữ liệu vào file JSON
        addDataToJson('json/data.json', data);

        // return data;
        return data;
    }

    // Hàm gọi API để lấy dữ liệu từ nhiều ID
    fetchByIds = async (ids, jsonId) => {
        const errorIds = [];
        const logDir = `json/${jsonId}/logs`;

        for (const id of ids) {
            try {
                console.log(`Fetching data for id ${id}...`);

                // Lấy dữ liệu từ API
                const data = await this.fetchApi(id);

                // Thêm dữ liệu vào file JSON
                addDataToJson(`json/${jsonId}/data.json`, data, id);

                // Ghi ID vào file success.txt
                fs.appendFileSync(`${logDir}/success.txt`, `${id},\n`, 'utf8');

            } catch (error) {
                // Ghi ID vào file error.txt
                fs.appendFileSync(`${logDir}/error.txt`, `${id},\n`, 'utf8');
                errorIds.push(id);
            }

            // Chờ 1 giây
            await delay(this.delay);
        }

        return errorIds;
    }
}

module.exports = new FetchApiService();
const fetchApiService = require("../services/fetchApiService");
const fs = require('fs');

class FetchApiController {
    async fetchById(req, res) {
        try {
            const id = req.query.id;

            // Kiểm tra xem id có tồn tại và là số không
            if (!id || isNaN(id)) {
                return res.status(400).json({ message: 'Invalid ID' });
            }

            // Kiểm tra id có trong tệp JSON không thì trả về dữ liệu từ tệp
            if (fs.existsSync('json/data.json')) {
                const fileContent = fs.readFileSync('json/data.json', 'utf8');
                const data = JSON.parse(fileContent);

                const item = data.find(item => item.appId === parseInt(id));

                if (item) {
                    return res.json(item);
                }
            }

            // Gọi service để lấy dữ liệu
            const result = await fetchApiService.fetchById(id);

            // Nếu không có dữ liệu thì trả về thông báo
            if (!result) {
                console.log('Data not found');
                return res.status(404).json({ message: 'Data not found' });
            }

            // Trả về dữ liệu
            res.json(result);
        }
        catch (error) {
            console.log(error);
        }
    }

    async fetchByIds(req, res) {
        try {
            const ids = req.body.ids;
            let jsonId = req.body.jsonId;

            // Kiểm tra xem ids có tồn tại không
            if (!ids) {
                return res.status(400).json({ message: 'Invalid IDs' });
            }

            // Chuyển ids thành mảng và xóa các khoảng trắng
            const idList = ids.split(',').map(id => id.replace(/\n/g, '').trim());

            // File JSON name
            let fileJSONName;
            jsonId = jsonId && jsonId.replace(/\n/g, '');

            // Kiểm tra xem có truyền jsonId không
            if (jsonId) {
                fileJSONName = `data-${jsonId}`;
            } else {
                // Khởi tạo tên file JSON theo định dạng data-yyyymmdd
                const date = new Date(); 
                jsonId = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
                fileJSONName = `data-${jsonId}`;

                // Helper function: Tạo thư mục nếu nó không tồn tại
                const ensureDir = (dirPath) => {
                    if (!fs.existsSync(dirPath)) {
                        fs.mkdirSync(dirPath, { recursive: true });
                        console.log(`Created folder ${dirPath} successfully!`);
                    }
                };

                // Helper function: Tạo file nếu nó không tồn tại
                const ensureFile = (filePath, defaultContent = '') => {
                    if (!fs.existsSync(filePath)) {
                        fs.writeFileSync(filePath, defaultContent, 'utf8');
                        console.log(`Created file ${filePath} successfully!`);
                    }
                };

                // Tạo thư mục và file cần thiết
                ensureDir('json');
                ensureDir(`json/${fileJSONName}`);
                ensureDir(`json/${fileJSONName}/logs`);

                // Tạo file data.json, success.txt, error.txt
                ensureFile(`json/${fileJSONName}/data.json`, '[]');
                ensureFile(`json/${fileJSONName}/logs/success.txt`);
                ensureFile(`json/${fileJSONName}/logs/error.txt`);
            }

            // Hàm lấy id từ file txt
            const getIdFromFile = (fileName) => {
                // Đọc dữ liệu từ file txt
                const data = fs.readFileSync(fileName, 'utf8');

                // 3,\n 4, => [3, 4]
                const ids = data.split(',').map(id => id.replace(/\n/g, ''));

                // Trả về mảng id
                return ids;
            };

            // Lấy dữ liệu từ tệp TXT
            const idSuccess = getIdFromFile(`json/${fileJSONName}/logs/success.txt`);
            // Lọc dữ liệu từ mảng ids không có trong tệp txt
            const idsNotInData = idList.filter(id => !idSuccess.includes(id));

            // Gọi service để lấy dữ liệu
            const errorIds = await fetchApiService.fetchByIds(idsNotInData, fileJSONName);

            // Trả về kết quả
            res.json({
                message: 'Crawl data successfully!',
                jsonId: jsonId,
                errorIds: errorIds,
            });
        }
        catch (error) {
            console.log(error);
        }
    }
}

module.exports = new FetchApiController();
const fs = require('fs');

// Hàm thêm dữ liệu vào tệp JSON
function addDataToJson(filePath, newData, key = null) {
    try {
        // Đọc nội dung của tệp JSON
        let data = [];
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            data = JSON.parse(fileContent); // Chuyển đổi từ chuỗi JSON sang đối tượng
        }

        // Kiểm tra nếu dữ liệu là mảng
        if (!Array.isArray(data)) {
            console.error('Data is not an array!');
            return;
        }

        // Kiểm tra xem dữ liệu mới có tồn tại trong mảng không
        const isExist = data.some(item => item.appId === newData.appId);
        if (isExist) {
            console.error('Data is already exist!');
            return;
        }

        // Thêm đối tượng mới vào mảng
        data.push(newData);

        // Sắp xếp mảng theo key
        if (key) {
            data.sort((a, b) => {
                return a[key] - b[key];
            });
        }

        // Ghi lại dữ liệu cập nhật vào tệp JSON
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Data has been added to ${filePath} successfully!`);

    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
    }
}

// Hàm đọc dữ liệu từ tệp JSON
function readDataFromJson(filePath) {
    try {
        // Đọc nội dung của tệp JSON
        if (fs.existsSync(filePath
        )) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(fileContent); // Chuyển đổi từ chuỗi JSON sang đối tượng
            return data;
        } else {
            console.error(`Tệp ${filePath} không tồn tại!`);
            return [];
        }
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        return [];
    }
}

// Hàm lấy dữ liệu theo key từ tệp JSON
const getDataByKey = (filePath, key, value) => {
    try {
        // Đọc nội dung của tệp JSON
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(fileContent); // Chuyển đổi từ chuỗi JSON sang đối tượng

            // Lấy 1 đối tượng dựa trên key và value
            const result = data.find(item => item.appId === value);
            return result;
        }
    }
    catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        return [];
    }
}

module.exports = {
    addDataToJson,
    readDataFromJson,
    getDataByKey,
};
import axios from "@/config/axios";

// Biến timeoutId để lưu trữ ID của hàm `setTimeout`, dùng để hủy nếu cần.
let timeoutId: NodeJS.Timeout | null = null;

/**
 * Gửi API kiểm tra tên người dùng sau khi người dùng nhập liệu, 
 * áp dụng debounce để giảm số lượng yêu cầu.
 * 
 * @param userName - Tên người dùng cần kiểm tra
 * @returns Lời nhắn từ API hoặc chuỗi rỗng nếu xảy ra lỗi
 */
export const CheckUserName = async (
    userName: string
): Promise<string> => {
    // Xóa timeout trước đó nếu có (debounce)
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    // Sử dụng `Promise` để đảm bảo hàm trả về giá trị sau khi xử lý xong.
    return new Promise((resolve) => {
        // Thiết lập timeout để trì hoãn việc gọi API
        timeoutId = setTimeout(async () => {
            try {
                // Gửi yêu cầu kiểm tra tên người dùng qua API
                const response = await axios.post('/api/auth/check-username', {
                    userName, // Truyền trực tiếp biến userName (ES6 shorthand syntax)
                });

                // Trả về thông báo từ API
                resolve(response.data.message);
            } catch (error) {
                console.log(error);
                // Xử lý lỗi (trả về chuỗi rỗng nếu lỗi xảy ra)
                resolve("");
            }
        }, 1000); // Độ trễ debounce là 2000ms
    });
};

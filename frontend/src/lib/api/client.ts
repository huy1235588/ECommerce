import axios from 'axios';
import { API_CONFIG } from '@/lib/constants';
import { TokenService } from '@/lib/auth';

// Tạo một instance của axios với cấu hình mặc định
export const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    withCredentials: true,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
});

// Interceptor để thêm token vào header của mỗi request
apiClient.interceptors.request.use(
    (config) => {
        const token = TokenService.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor để xử lý lỗi 401 và tự động refresh token
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu nhận được lỗi 401, thử refresh token
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true; // Đánh dấu đã retry để tránh vòng lặp vô hạn

            try {
                // Gọi endpoint refresh token
                // LƯU Ý: Axios sẽ tự động gửi cookie (chứa refresh token) đi cùng request này
                const refreshResponse = await apiClient.post('/auth/refresh');

                const { accessToken: newAccessToken } = refreshResponse.data;

                // Cập nhật access token mới
                TokenService.setTokens(newAccessToken);

                // Cập nhật header Authorization cho request gốc và thử lại
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);

            } catch (refreshError) {
                // Xử lý logout khi refresh thất bại
                handleLogout();
                return Promise.reject(refreshError);
            }
        }

        // Nếu không phải lỗi 401 hoặc đã retry, trả về lỗi
        return Promise.reject(error);
    }
);

// Hàm xử lý logout tập trung
function handleLogout() {
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
    TokenService.clearTokens();
    // window.location.href = '/login';
}

export default apiClient;

import axios, { AxiosError } from "axios";

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    withCredentials: true      // Để gửi kèm cookie trong yêu cầu
});

// Thêm một interceptor cho yêu cầu (request)
instance.interceptors.request.use(function (config) {
    // Xử lý trước khi họi request
    return config;
}, function (error: AxiosError) {
    // Xử lý lỗi khi xảy ra lỗi ở giai đoạn gửi request 
    console.error("Request error:", error.message);
    return Promise.reject(error);
});

// Thêm một interceptor cho phản hồi (response)
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Kiểm tra xem lỗi có phải là AxiosError hay không
    if (axios.isAxiosError(error)) {
        if (error.response) {
            console.error("Response error:", {
                status: error.response.status,
                data: error.response.data,
            });
        } else {
            console.error("No response received:", error.message);
        }
    } else {
        // Lỗi không thuộc Axios
        console.error("Unexpected error:", error);
    }

    return Promise.reject(error);
});

export default instance;
import axios from "axios";

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: process.env.SERVER_URL
});

// Alter defaults after instance has been created
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

// Thêm một request interceptor
instance.interceptors.request.use(function (config) {
    // Xử lý trước khi họi request
    return config;
}, function (error) {
    // Xử lý khi request lỗi
    return Promise.reject(error);
});

// Thêm một response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export default instance;
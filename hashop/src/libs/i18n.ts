import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Hàm tải dữ liệu dịch từ file JSON
const loadTranslations = async (lng: string) => {
    const response = await fetch(`/locales/${lng}/translation.json`);
    const translations = await response.json();
    return translations;
};

// Khởi tạo i18n và cấu hình
i18n
    .use(initReactI18next)
    .init({
        lng: 'en', // Ngôn ngữ mặc định
        fallbackLng: 'en', // Ngôn ngữ dự phòng
        resources: {},
        interpolation: {
            escapeValue: false, // React đã bảo vệ tự động khỏi XSS
        },
        load: 'currentOnly', // Chỉ tải ngôn ngữ hiện tại
    });

// Tải dữ liệu dịch vào i18n
const loadLanguages = async () => {
    const langs = ['en', 'vi'];
    for (const lng of langs) {
        const translations = await loadTranslations(lng);
        i18n.addResourceBundle(lng, 'translation', translations, true, true);
    }
};

loadLanguages();

export default i18n;

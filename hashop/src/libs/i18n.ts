import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Hàm xác định ngữ cảnh
const isServer = typeof window === 'undefined';

const loadTranslations = async (lng: string) => {
    let response;

    if (isServer) {
        // Khi chạy trên server, sử dụng URL tuyệt đối
        const absolutePath = `http://localhost:3000/locales/${lng}/translation.json`;
        response = await fetch(absolutePath);
    } else {
        // Khi chạy trên client, sử dụng URL tương đối
        response = await fetch(`/locales/${lng}/translation.json`);
    }

    if (!response.ok) {
        throw new Error(`Failed to load translations for language: ${lng}`);
    }

    return await response.json();
};

i18n
    .use(initReactI18next)
    .init({
        lng: 'en',
        fallbackLng: 'en',
        resources: {},
        interpolation: {
            escapeValue: false,
        },
        load: 'currentOnly',
    });

const loadLanguages = async () => {
    const langs = ['en', 'vi'];
    for (const lng of langs) {
        const translations = await loadTranslations(lng);
        i18n.addResourceBundle(lng, 'translation', translations, true, true);
    }
};

loadLanguages();

export default i18n;

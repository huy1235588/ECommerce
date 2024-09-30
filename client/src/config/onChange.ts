import axios from "axios";

let timeoutId: NodeJS.Timeout | null = null;

export const OnChangeUserName = async (
    userName: string,
): Promise<string> => {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    return new Promise((resolve) => {
        // Set a timeout to delay the API call
        timeoutId = setTimeout(async () => {
            try {
                const response = await axios.post('/api/auth/check-username', {
                    userName: userName,
                });
                resolve(response.data.message);  // Resolve with the API response
            } catch (error) {
                console.error("Error checking value:", error);
                resolve("");  // Resolve with an empty string on error
            }
        }, 2000);
    });
};
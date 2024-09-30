export const createInitialState = (formData: any, value: any) => {
    const initialState: Partial<any> = {};

    for (const key in formData) {
        initialState[key] = value;
    }

    return initialState;
};
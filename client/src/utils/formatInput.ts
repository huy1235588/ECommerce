export const validateEmail = (email: string) => {
    if (email.trim().length === 0) return "Required";
    if (!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        return "Invalid email";
    }
    if (email.length >= 255) return "Too long";
    return "";
};

export const getStrongPassword = (pass: string) => {
    if (pass.trim().length === 0) return "Required";
    if (pass.length <= 6) return "Too short";
    if (!/^(?=.*[a-zA-Z])(?=.*\d)(?!.*\s).+$/.test(pass)) return "Invalid format";
    if (pass.length >= 255) return "Too long";
    return "";
};

export const requiredInput = (value: string) => {
    return value.trim() ? "" : "Required";
}

export const validateUserName = (pass: string) => {
    if (pass.trim().length === 0) return "Required";
    if (pass.length <= 2) return "Too short";
    if (pass.match(/\s/)) return "Invalid format";
    return "";
};

export const validateName = (pass: string) => {
    if (pass.trim().length === 0) return "Required";
    if (pass.length >= 255) return "Too long";
    return "";
};
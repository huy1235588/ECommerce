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

export const validateConfirmPassword = (password: string, confirmPassword?: string) => {
    if (!confirmPassword) return "Required";
    if (confirmPassword.trim().length === 0) return "Required";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
};

export const requiredInput = (value: string) => {
    return value.trim() ? "" : "Required";
}

export const validateUserName = (userName: string) => {
    if (userName.trim().length === 0) return "Required";
    if (userName.length <= 2) return "Too short";
    if (userName.match(/\s/)) return "Invalid format";

    return "";
};

export const validateName = (pass: string) => {
    if (pass.trim().length === 0) return "Required";
    if (pass.length >= 255) return "Too long";
    return "";
};

export const validateNumber = (value: string) => {
    value = value.trim();
    if (!value) return "Required";
    if (!/^[0-9]+$/.test(value)) return "Invalid format";
    return "";
};

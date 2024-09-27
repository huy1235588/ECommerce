export const validateEmail = (email: string) => {
    if (email.trim().length === 0) return "Required";
    if (!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        return "Invalid email";
    }
    return "";
};

export const getStrongPassword = (pass: string) => {
    const invalidFormat = "Invalid format";
    if (pass.trim().length === 0) return "Required";
    if (pass.length <= 6) return "Too short";
    if (!pass.match(/[a-zA-Z]/)) return invalidFormat;
    if (!pass.match(/\d/)) return invalidFormat;
    if (pass.match(/\s/)) return invalidFormat;
    return "";
};

export const requiredInput = (value: string) => {
    return value.trim() ? "" : "Required";
}


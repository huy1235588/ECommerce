type FormControl = {
    name: string;
    placeholder: string;
    autocomplete?: string;
    componentType: "input" | "textarea" | "select";
    type?: "text" | "email" | "password" | "number" | "checkbox";
    options?: { id: string, label: string }[];
};

const countries = [
    { id: "us", label: "United States" },
    { id: "ca", label: "Canada" },
    { id: "uk", label: "United Kingdom" },
    { id: "au", label: "Australia" },
    { id: "vn", label: "Việt Nam" },
];

export const registerFormControls: FormControl[] = [
    {
        name: "email",
        placeholder: "Email",
        autocomplete: "email",
        componentType: "input",
        type: "email",
    },
    {
        name: "country",
        placeholder: "Country",
        autocomplete: "country",
        componentType: "select",
        options: countries,
    },
    {
        name: "firstName",
        placeholder: "First Name",
        autocomplete: "given-name",
        componentType: "input",
        type: "text",
    },
    {
        name: "lastName",
        placeholder: "Last Name",
        autocomplete: "family-name",
        componentType: "input",
        type: "text",
    },
    {
        name: "userName",
        placeholder: "User Name",
        autocomplete: "username",
        componentType: "input",
        type: "text",
    },
    {
        name: "password",
        placeholder: "Password",
        autocomplete: "new-password",
        componentType: "input",
        type: "password",
    }
];

export const loginFormControls: FormControl[] = [
    {
        name: "email",
        placeholder: "Email",
        autocomplete: "",
        componentType: "input",
        type: "email",
    },
    {
        name: "password",
        placeholder: "Password",
        autocomplete: "",
        componentType: "input",
        type: "password",
    },
];

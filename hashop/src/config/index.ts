import {
    getStrongPassword,
    requiredInput,
    validateEmail,
    validateName,
    validateUserName
} from "@/utils/formatInput";

import { countries } from "./countryForm";

type FormControl = {
    name: "email" | "country" | "firstName" | "lastName" | "userName" | "password";
    placeholder: string;
    componentType: "input" | "textarea" | "select";
    type?: "text" | "email" | "password" | "number";
    autocomplete?: string;
    options?: { id: string; label: string }[];
    tooltipTile?: string;
    className?: string;
    maxLength?: number;
    onChange?: (value: string) => string;
};

// Form controls for registration
export const registerFormControls: FormControl[] = [
    {
        name: "email",
        placeholder: "Email",
        autocomplete: "email",
        componentType: "input",
        type: "email",
        maxLength: 1000,
        onChange: validateEmail,
    },
    {
        name: "country",
        placeholder: "Country",
        componentType: "select",
        options: countries,
        onChange: requiredInput,
    },
    {
        name: "firstName",
        placeholder: "First Name",
        autocomplete: "given-name",
        componentType: "input",
        type: "text",
        className: "input-form-48",
        maxLength: 1000,
        onChange: validateName,
    },
    {
        name: "lastName",
        placeholder: "Last Name",
        autocomplete: "family-name",
        componentType: "input",
        type: "text",
        className: "input-form-48",
        maxLength: 1000,
        onChange: validateName,
    },
    {
        name: "userName",
        placeholder: "Username",
        autocomplete: "username",
        componentType: "input",
        type: "text",
        tooltipTile: "User Name must be 3 to 16 characters long and can contain letters, numbers, hyphens, periods, underscores, and no spaces.",
        maxLength: 16,
        onChange: validateUserName,
    },
    {
        name: "password",
        placeholder: "Password",
        autocomplete: "new-password",
        componentType: "input",
        type: "password",
        tooltipTile: "Passwords must have 7 to 255 characters, at least 1 number, at least 1 letter, and no whitespace.",
        maxLength: 1000,
        onChange: getStrongPassword,
    },
];

// Form controls for login
export const loginFormControls: FormControl[] = [
    {
        name: "email",
        placeholder: "Email",
        componentType: "input",
        type: "email",
        maxLength: 1000,
        onChange: validateEmail,
    },
    {
        name: "password",
        placeholder: "Password",
        componentType: "input",
        type: "password",
        maxLength: 1000,
        onChange: requiredInput,
    },
];

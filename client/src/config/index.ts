import { getStrongPassword, requiredInput, validateEmail, validateName, validateUserName } from "@/utils/formatInput";
import { countries } from "./countryForm";
import { InputPasswordLogin, InputPasswordRegister, InputUserNameRegister } from "./customComponent";

type FormControl = {
    name: "email" | "country" | "firstName" | "lastName" | "userName" | "password";
    placeholder: string;
    autocomplete?: string;
    componentType: "input" | "textarea" | "select";
    type?: "text" | "email" | "password" | "number" | "checkbox";
    options?: { id: string, label: string }[];
    inputStyle?: string | null;
    maxLength?: number;
    onChange: (value: string) => string;
    inputComponent?: React.ComponentType<any>;
};

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
        autocomplete: "country",
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
        inputStyle: "w-[48%]",
        maxLength: 1000,
        onChange: validateName,
    },
    {
        name: "lastName",
        placeholder: "Last Name",
        autocomplete: "family-name",
        componentType: "input",
        type: "text",
        inputStyle: "w-[48%]",
        maxLength: 1000,
        onChange: validateName,
    },
    {
        name: "userName",
        placeholder: "UserName",
        autocomplete: "username",
        componentType: "input",
        type: "text",
        maxLength: 16,
        onChange: validateUserName,
        inputComponent: InputUserNameRegister,
    },
    {
        name: "password",
        placeholder: "Password",
        autocomplete: "new-password",
        componentType: "input",
        type: "password",
        maxLength: 1000,
        onChange: getStrongPassword,
        inputComponent: InputPasswordRegister,
    }
];

export const loginFormControls: FormControl[] = [
    {
        name: "email",
        placeholder: "Email",
        autocomplete: "",
        componentType: "input",
        type: "email",
        maxLength: 1000,
        onChange: validateEmail,
    },
    {
        name: "password",
        placeholder: "Password",
        autocomplete: "",
        componentType: "input",
        type: "password",
        maxLength: 1000,
        onChange: requiredInput,
        inputComponent: InputPasswordLogin,
    },
];
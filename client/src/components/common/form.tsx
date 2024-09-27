import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { getStrongPassword, requiredInput, validateEmail } from "@/utils/formatInput";

type FormControl = {
    name: "email" | "country" | "firstName" | "lastName" | "userName" | "password";
    placeholder: string;
    autocomplete?: string;
    componentType: "input" | "textarea" | "select";
    type?: "text" | "email" | "password" | "number" | "checkbox";
    options?: { id: string, label: string }[];
    ha?: string | null,
};

interface CommonFormProps {
    formControl: FormControl[];
    formData: any;
    setFormData: any;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    buttonText?: string;
    isBtnDisabled?: boolean;
    isFormValid?: boolean;
}

function CommonForm({
    formControl,
    formData,
    setFormData,
    onSubmit,
    buttonText,
    isFormValid,
}: CommonFormProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isFormValid) {
            onSubmit(event);
        }
    };

    function renderInputs(getControlItem: FormControl) {
        const [inputValue, setInputValue] = useState("");
        const [formatInput, setFormatInput] = useState("");
        const [inputType, setInputType] = useState(getControlItem.type);

        // Ẩn hiện mật khẩu
        const handleToggleType = () => {
            setInputType((prevType) => (prevType === "password" ? "text" : "password"));
        };

        let element = null;

        const value = formData[getControlItem.name] || ""

        // INPUT
        switch (getControlItem.componentType) {
            case "input":
                element = (
                    <>
                        <Input
                            className={`peer h-16 px-3 pt-7 pb-3 text-lg focus-visible:ring-1 ${formatInput !== "" ? 'ring-1 ring-red-600 ' : ''}`}
                            name={getControlItem.name}
                            id={getControlItem.name}
                            type={inputType}
                            placeholder=""
                            value={value}
                            onChange={(event) => {
                                setInputValue(event.target.value);
                                setFormData({
                                    ...formData,
                                    [getControlItem.name]: event.target.value,
                                })
                            }}
                            onBlur={() => {
                                if (getControlItem.type === "email") {
                                    setFormatInput(validateEmail(inputValue));
                                    return;
                                }
                                else if (getControlItem.type === "password" && buttonText === "Create Account") {
                                    setFormatInput(getStrongPassword(inputValue));
                                    return;
                                }
                                else {
                                    setFormatInput(requiredInput(inputValue));
                                }
                            }}
                            onFocus={() => setFormatInput("")}
                        />
                        {formatInput !== "" ? (
                            <span className="text-xs text-red-600">
                                {formatInput}
                            </span>
                        ) : null}
                        {getControlItem.type === "password" && (
                            <>
                                <button
                                    type="button"
                                    className="absolute right-3 top-3 bg-transparent hover:bg-gray-800 duration-200 py-3 px-3 focus:outline-none border-none"
                                    onClick={handleToggleType}
                                >
                                    {inputType === "password" ? <BiSolidHide /> : <BiSolidShow />}
                                </button>
                            </>
                        )}
                    </>
                );
                break;

            // Select
            case "select":
                element = (
                    <Select
                        onValueChange={(value) =>
                            setFormData({
                                ...formData,
                                [getControlItem.name]: value,
                            })
                        }
                        value={value}
                        autoComplete={getControlItem.autocomplete}
                    >
                        <SelectTrigger
                            className="w-full h-16 dark static"
                            onClick={() => setIsOpen(true)}
                        >
                            <SelectValue placeholder={getControlItem.placeholder} >
                                {value}
                            </SelectValue>
                        </SelectTrigger>

                        {isOpen && (
                            <SelectContent
                                className="bg-gray-800 text-white overflow-y-scroll"
                                onCloseAutoFocus={() => setIsOpen(false)}
                            >
                                {getControlItem.options && getControlItem.options.length > 0
                                    ? getControlItem.options.map(optionItem => (
                                        <SelectItem
                                            className=""
                                            key={optionItem.id}
                                            value={optionItem.label}
                                        >
                                            {optionItem.label}
                                        </SelectItem>
                                    )) : null}
                            </SelectContent>
                        )}
                    </Select>
                );
                break;

            // TEXTAREA
            case "textarea":
                element = (
                    <Textarea
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        id={getControlItem.name}
                        value={value}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                [getControlItem.name]: event.target.value,
                            })
                        }
                    />
                );
                break;

            default:
                element = (
                    <>
                        <Input
                            className="peer px-3 pt-7 pb-3"
                            name={getControlItem.name}
                            id={getControlItem.name}
                            type={inputType}
                            placeholder=""
                            value={value}
                            onChange={(event) =>
                                setFormData({
                                    ...formData,
                                    [getControlItem.name]: event.target.value,
                                })
                            }
                        />
                        {getControlItem.type === "password" && (
                            <button
                                className="absolute right-3 top-3 bg-transparent hover:bg-gray-800 duration-200 py-3 px-3 focus:outline-none border-none"
                                onClick={handleToggleType}
                            >
                                {inputType === "password" ? <BiSolidHide /> : <BiSolidShow />}
                            </button>
                        )}
                    </>
                );
                break;
        }

        return element;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap justify-between">
                {formControl.map((controlIem) => (
                    controlIem.ha !== undefined
                        ? (<div className={`relative grid ${controlIem.ha} min-h-[88px]`} key={controlIem.name}>
                            {renderInputs(controlIem)}
                            {controlIem.componentType === "input" && (
                                <label
                                    className="absolute cursor-text select-none text-gray-500 duration-200 transform -translate-y-0 top-5 z-10 origin-[0] left-4 peer-focus:-translate-y-4 peer-focus:scale-[0.85] peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-[0.85]"
                                    htmlFor={controlIem.name}
                                >
                                    {controlIem.placeholder}
                                </label>
                            )}
                        </div>)
                        : (<div className="relative grid w-full min-h-[88px]" key={controlIem.name}>
                            {renderInputs(controlIem)}
                            {controlIem.componentType === "input" && (
                                <label
                                    className="absolute cursor-text select-none text-gray-500 duration-200 transform -translate-y-0 top-5 z-10 origin-[0] left-4 peer-focus:-translate-y-4 peer-focus:scale-[0.85] peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-[0.85]"
                                    htmlFor={controlIem.name}
                                >
                                    {controlIem.placeholder}
                                </label>
                            )}
                        </div>)
                ))}
            </div>

            <Button type="submit" disabled={!isFormValid} className=" w-full">
                {buttonText || 'Submit'}
            </Button>
        </form>
    );
}

export default CommonForm;
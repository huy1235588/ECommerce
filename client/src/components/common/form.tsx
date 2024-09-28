import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

type FormControl = {
    name: "email" | "country" | "firstName" | "lastName" | "userName" | "password";
    placeholder: string;
    autocomplete?: string;
    componentType: "input" | "textarea" | "select";
    type?: "text" | "email" | "password" | "number" | "checkbox";
    options?: { id: string, label: string }[];
    inputStyle?: string | null;
    maxLength?: number;
    onBlur?: (value: string) => string | "";
    inputComponent?: React.ComponentType<any>;
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

        let element = null;

        const value = formData[getControlItem.name] || "" // Lấy giá trị hiện tại
        const InputComponent = getControlItem.inputComponent;

        // INPUT
        switch (getControlItem.componentType) {
            case "input":
                element = (
                    <>
                        <Input
                            className={`peer h-16 px-3 pt-7 pb-3 text-lg focus-visible:ring-1 ${formatInput !== "" ? 'ring-1 ring-red-600 ' : ''} ${getControlItem.type === "password" ? "pr-28" : ""}`}
                            name={getControlItem.name}
                            id={getControlItem.name}
                            type={inputType}
                            placeholder=""
                            maxLength={getControlItem.maxLength}
                            value={value}
                            onChange={(event) => {
                                setInputValue(event.target.value);
                                setFormData({
                                    ...formData,
                                    [getControlItem.name]: event.target.value,
                                })
                            }}
                            onBlur={() => {
                                if (getControlItem.onBlur) {
                                    setFormatInput(getControlItem.onBlur(inputValue));
                                }
                                return;
                            }}
                            onFocus={() => setFormatInput("")}
                        />
                        {formatInput !== "" ? (
                            <span className="text-[11px] text-red-600 mb-0.5">
                                {formatInput}
                            </span>
                        ) : null}
                        {InputComponent ? (
                            <InputComponent
                                inputType={inputType}
                                setInputType={setInputType}
                                name={getControlItem.name}
                            />
                        ) : null}
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
                            type={getControlItem.type}
                            placeholder=""
                            value={value}
                            onChange={(event) =>
                                setFormData({
                                    ...formData,
                                    [getControlItem.name]: event.target.value,
                                })
                            }
                        />
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
                    controlIem.inputStyle !== undefined
                        ? (<div className={`relative grid ${controlIem.inputStyle} min-h-[88px]`} key={controlIem.name}>
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

            <Button type="submit" disabled={!isFormValid} className=" w-full select-none">
                {buttonText || 'Submit'}
            </Button>
        </form>
    );
}

export default CommonForm;
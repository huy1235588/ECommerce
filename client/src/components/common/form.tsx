import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

type FormControl = {
    name: string;
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
}

function CommonForm({
    formControl,
    formData,
    setFormData,
    onSubmit,
    buttonText,
}: CommonFormProps) {

    function renderInputs(getControlItem: FormControl) {
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
                            className="peer h-16 px-3 pt-7 pb-3 text-lg"
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
                    >
                        <SelectTrigger className="w-full h-16 dark static">
                            <SelectValue placeholder={getControlItem.placeholder} />
                        </SelectTrigger>

                        <SelectContent className=" bg-gray-800 text-white overflow-y-scroll">
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
        <form onSubmit={onSubmit}>
            <div className="flex flex-wrap justify-between gap-3">
                {formControl.map((controlIem) => (
                    controlIem.ha !== undefined
                        ? (<div className={`relative grid ${controlIem.ha} gap-x-0 gap-y-1.5`} key={controlIem.name}>
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
                        : (<div className="relative grid w-full gap-1.5" key={controlIem.name}>
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

            <Button type="submit" className="mt-7 w-full">
                {buttonText || 'Submit'}
            </Button>
        </form>
    );
}

export default CommonForm;
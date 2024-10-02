import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { requiredInput } from "@/utils/formatInput";
import { OnChangeUserName } from "@/config/onChange";
import { createInitialState } from "@/utils/state";
import { BiLoaderAlt } from "react-icons/bi";
import { BiSolidXCircle } from "react-icons/bi";

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

// Khởi tạo kiểu từ formData và đổi thành boolean
type validationFormData = {
    [key in keyof CommonFormProps['formData']]: boolean;
}

interface CommonFormProps {
    formControl: FormControl[];
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    buttonText?: string;
    isBtnDisabled?: boolean;
    isLoading: boolean;
    isError: string | null | undefined;
}

function CommonForm({
    formControl,
    formData,
    setFormData,
    onSubmit,
    buttonText,
    isLoading,
    isError,
}: CommonFormProps) {
    const [isOpenSelect, setIsOpenSelect] = useState(false); // Khi nhấp vào select

    // Khởi tạo key ban đầu là false
    const initialValidationState = createInitialState(formData, false)
    // Xác thực các input đã nhập hợp lệ
    const [validationState, setValidationState] = useState<validationFormData>(initialValidationState);

    // Kiểm tra nếu toàn bộ input hợp lệ
    const isFormValid = Object.values(validationState).every((isValid) => isValid);

    // Khi submit form
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Nếu toàn bộ input trong form hợp lệ
        if (isFormValid) {
            onSubmit(event);
        }
    };

    function renderInputs(getControlItem: FormControl) {
        const [inputValue, setInputValue] = useState(""); // Lấy giá trị trong input
        const [formatInput, setFormatInput] = useState(""); // ghi lỗi khi input không hợp lệ
        const [inputType, setInputType] = useState(getControlItem.type);
        const [isValidOnChange, setIsValidOnchange] = useState(""); // kiểm tra sự thay đổi của input có hợp lệ

        let element = null;

        const value = formData[getControlItem.name] || "" // Lấy giá trị hiện tại
        const InputComponent = getControlItem.inputComponent; // Tùy chọn thêm component

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
                                // Kiểm tra input có hợp lệ, nếu có thì trả về chuỗi rỗng ""
                                const validInput = getControlItem.onChange(event.target.value);
                                setIsValidOnchange(validInput);

                                // Gán chuỗi rỗng thì gán giá trị true 
                                if (validInput === "") {
                                    setValidationState((prevState) => ({
                                        ...prevState,
                                        [getControlItem.name]: true,
                                    }));
                                }
                                // Trường hợp input không hợp lệ
                                else {
                                    setValidationState((prevState) => ({
                                        ...prevState,
                                        [getControlItem.name]: false,
                                    }));
                                }

                                // Kiểm tra userName có tồn tại trong db
                                if (getControlItem.name === "userName" && validInput === "") {
                                    // Set false trước khi kiểm tra
                                    setValidationState((prevState) => ({
                                        ...prevState,
                                        [getControlItem.name]: false,
                                    }));

                                    OnChangeUserName(event.target.value)
                                        .then(result => {
                                            setIsValidOnchange(result);
                                            setFormatInput(result);

                                            // result trả về chuỗi rỗng khi useName không tồn tại
                                            if (result === "") {
                                                setValidationState((prevState) => ({
                                                    ...prevState,
                                                    [getControlItem.name]: true,
                                                }));
                                            }
                                        })
                                }

                                // Lấy dữ liệu input
                                setInputValue(event.target.value);
                                // Đưa dữ liệu vào formData
                                setFormData({
                                    ...formData,
                                    [getControlItem.name]: event.target.value,
                                });
                            }}
                            onBlur={() => {
                                // Kiểm tra input không rỗng
                                const isEmpty = requiredInput(inputValue);

                                if (isEmpty === "") {
                                    // Kiểm giá trị họp lệ mỗi input
                                    setFormatInput(isValidOnChange);
                                }
                                else {
                                    setFormatInput(isEmpty)
                                }
                            }}
                            onFocus={() => setFormatInput("")}
                        />
                        {formatInput !== "" ? (
                            <span className="text-sm text-red-600 mb-0.5">
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
                        onValueChange={(value) => {
                            const validInput = getControlItem.onChange(value);

                            if (validInput === "") {
                                setValidationState((prevState) => ({
                                    ...prevState,
                                    [getControlItem.name]: true,
                                }));
                            }
                            else {
                                setValidationState((prevState) => ({
                                    ...prevState,
                                    [getControlItem.name]: false,
                                }));
                            }

                            setFormData({
                                ...formData,
                                [getControlItem.name]: value,
                            })
                        }
                        }
                        value={value}
                        autoComplete={getControlItem.autocomplete}
                    >
                        <SelectTrigger
                            className="w-full h-16 dark static"
                            onClick={() => setIsOpenSelect(true)}
                        >
                            <SelectValue placeholder={getControlItem.placeholder} >
                                {value}
                            </SelectValue>
                        </SelectTrigger>

                        {isOpenSelect && (
                            <SelectContent
                                className="bg-gray-800 text-white overflow-y-scroll"
                                onCloseAutoFocus={() => setIsOpenSelect(false)}
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
            {isError && (
                <p className="flex items-center mb-5 p-5 rounded-md bg-gray-800 text-red-500">
                    <BiSolidXCircle className="mr-3" />
                    {isError}
                </p>
            )}
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

            <Button
                type="submit"
                disabled={!isFormValid}
                className=" w-full select-none"
            >
                {isLoading
                    ? (<BiLoaderAlt />)
                    : (buttonText || 'Submit')
                }
            </Button>
        </form>
    );
}

export default CommonForm;
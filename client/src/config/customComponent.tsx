import React, { useState } from "react";
import { BiInfoCircle, BiSolidHide, BiSolidShow } from "react-icons/bi";

interface CustomInputProps {
    inputType: any;
    setInputType: any;
    name?: string;
}

export const InputUserNameRegister: React.FC<CustomInputProps> = ({
    name,
}) => {
    const [toolTip, setToolTip] = useState(false);

    let timeoutId: NodeJS.Timeout;

    return (
        <div className="absolute right-3 top-3 flex z-10">
            <label
                className=" bg-transparent hover:bg-gray-800 duration-200 py-3 px-3 focus:outline-none border-none cursor-pointer"
                htmlFor={name}
                onMouseEnter={() => {
                    timeoutId = setTimeout(() => {
                        setToolTip(true);
                    }, 300)
                }}
                onMouseLeave={() => setTimeout(() => {
                    clearTimeout(timeoutId)
                    setToolTip(false);
                })}
            >
                <BiInfoCircle />
            </label>
            {toolTip && (
                <div className="absolute bottom-12 -right-4 lg:-right-24 w-60 bg-gray-800 p-3 rounded-lg duration-1000 text-sm select-none">
                    User Name must be 3 to 16 characters long and can contain letters, numbers, hyphens, periods, underscores, and no spaces.
                </div>
            )}
        </div>
    );
}

export const InputPasswordRegister: React.FC<CustomInputProps> = ({
    inputType,
    setInputType,
    name,
}) => {
    const [toolTip, setToolTip] = useState(false);

    let timeoutId: NodeJS.Timeout;

    // Ẩn hiện mật khẩu
    const handleToggleType = () => {
        setInputType((prevType: string) => (prevType === "password" ? "text" : "password"));
    };

    return (
        <div className="absolute right-3 top-3 flex z-10">
            <button
                type="button"
                className=" bg-transparent hover:bg-gray-800 duration-200 py-3 px-3 focus:outline-none border-none"
                onClick={handleToggleType}
            >
                {inputType === "password" ? <BiSolidHide /> : <BiSolidShow />}
            </button>
            <label
                className=" bg-transparent hover:bg-gray-800 duration-200 py-3 px-3 focus:outline-none border-none cursor-pointer"
                htmlFor={name}
                onMouseEnter={() => {
                    timeoutId = setTimeout(() => {
                        setToolTip(true);
                    }, 300)
                }}
                onMouseLeave={() => setTimeout(() => {
                    clearTimeout(timeoutId)
                    setToolTip(false);
                })}
            >
                <BiInfoCircle />
            </label>
            {toolTip && (
                <div className="absolute bottom-12 -right-4 lg:-right-24 w-60 bg-gray-800 p-3 rounded-lg duration-1000 text-sm select-none">
                    Passwords must have 7 to 255 characters, at least 1 number, at least 1 letter, and no whitespace.
                </div>
            )}
        </div>
    );
};

export const InputPasswordLogin: React.FC<CustomInputProps> = ({
    inputType,
    setInputType,

}) => {
    // Ẩn hiện mật khẩu
    const handleToggleType = () => {
        setInputType((prevType: string) => (prevType === "password" ? "text" : "password"));
    };

    return (
        <div className="absolute right-3 top-3 flex">
            <button
                type="button"
                className=" bg-transparent hover:bg-gray-800 duration-200 py-3 px-3 focus:outline-none border-none"
                onClick={handleToggleType}
            >
                {inputType === "password" ? <BiSolidHide /> : <BiSolidShow />}
            </button>
        </div>
    );
};
import React, { useCallback, useState } from "react";
import {
    Button,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
    Typography,
    FormHelperText,
    InputAdornment,
    IconButton,
    Tooltip,
} from "@mui/material";
import { BiInfoCircle, BiSolidXCircle } from "react-icons/bi";
import { FormData } from "@/types/auth";
import { CheckUserName } from "@/utils/checkUserName";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FormControl as FormControlType } from "@/config/auth";

/*************************************************************************
 
   Các props được truyền vào cho component CommonForm

*************************************************************************/
interface CommonFormProps {
    formControl: FormControlType[];
    formData: Record<string, string>;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    buttonText?: string;
    isLoading: boolean;
    isError?: string | null;
}

const CommonForm: React.FC<CommonFormProps> = ({
    formControl,
    formData,
    setFormData,
    onSubmit,
    buttonText = "Submit",
    isLoading,
    isError,
}) => {
    const [formState, setFormState] = useState<{
        values: Record<string, string>;       // Lưu trữ giá trị nhập vào của các trường trong form
        errors: Record<string, string>;       // Lưu trữ thông báo lỗi cho mỗi trường
        isValid: Record<string, boolean>;     // Lưu trữ trạng thái hợp lệ (true/false) của từng trường
    }>(
        Object.keys(formData).reduce(
            (acc, key) => ({
                // Khởi tạo các trường cho mỗi trường nhập liệu trong form
                values: { ...acc.values, [key]: "" },   // Mặc định giá trị của tất cả các trường là chuỗi rỗng
                errors: { ...acc.errors, [key]: "" },   // Mặc định không có lỗi cho tất cả các trường
                isValid: { ...acc.isValid, [key]: false }, // Mặc định các trường đều không hợp lệ
            }),
            { values: {}, errors: {}, isValid: {} } // Giá trị mặc định ban đầu của formState
        )
    );

    // Trạng thái kiểm soát việc hiển thị mật khẩu
    const [showPassword, setShowPassword] = useState(false);

    // Kiểm tra tính hợp lệ của toàn bộ form
    const isFormValid = Object.values(formState.isValid).every(Boolean);

    // Khi submit form
    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Nếu toàn bộ input trong form hợp lệ
        if (isFormValid) {
            onSubmit(event);
        }
    }, [isFormValid, onSubmit]);

    // Hàm xử lý khi người dùng thay đổi giá trị nhập liệu
    const handleInputChange = useCallback((
        name: string,
        value: string,
        onChange?: (value: string) => string
    ) => {
        const validationResult = onChange ? onChange(value) : "";

        // Cập nhật giá trị input
        setFormState((prev) => ({
            ...prev,
            values: { ...prev.values, [name]: value },
            isValid: { ...prev.isValid, [name]: !validationResult },
        }));

        // Lưu dữ liệu của trường nhập liệu
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, [setFormData]);

    // Hàm kiểm tra lỗi khi input mất focus (blur)
    const handleValidation = async (
        name: string,
        value: string,
        onChange?: (value: string) => string
    ) => {
        const validationResult = onChange ? onChange(value) : "";
        const isFieldValid = !validationResult;

        setFormState((prev) => ({
            ...prev,
            isValid: { ...prev.isValid, [name]: !validationResult },
            errors: { ...prev.errors, [name]: validationResult },
        }));

        // Gọi hàm kiểm tra tên người dùng
        if (name === "userName" && isFieldValid) {
            const responseMessage = await CheckUserName(value);
            setFormState((prev) => ({
                ...prev,
                isValid: { ...prev.isValid, [name]: responseMessage !== "" },
                errors: { ...prev.errors, [name]: responseMessage },
            }));
        }

        await console.log(formState.isValid)
    };

    // Hàm xóa lỗi khi người dùng focus vào input
    const clearError = (name: string) => {
        setFormState((prev) => ({
            ...prev,
            errors: { ...prev.errors, [name]: "" },
        }));
    };

    // Hàm render các trường nhập liệu tùy theo loại componentType
    const renderInput = (control: FormControlType) => {
        const value = formState.values[control.name] || "";
        const hasError = formState.errors[control.name] !== "";
        const errorMessage = formState.errors[control.name] || "";

        switch (control.componentType) {
            case "input":
                return (
                    <div style={{ position: "relative" }}>
                        <TextField
                            className={`input-form ${control.className}`}
                            fullWidth
                            variant="outlined"
                            label={control.placeholder}
                            name={control.name}
                            type={control.type !== "password" ? control.type : showPassword ? "text" : "password"}
                            value={value}
                            autoComplete={control.autocomplete}
                            onChange={(e) =>
                                handleInputChange(control.name, e.target.value, control.onChange)
                            }

                            onBlur={() =>
                                handleValidation(control.name, value, control.onChange)
                            } // Đổi trạng thái hiển thị lỗi khi blur

                            onFocus={() =>
                                clearError(control.name)
                            }

                            error={hasError}
                            helperText={hasError ? errorMessage : ""}
                            slotProps={{
                                htmlInput: {
                                    maxLength: control.maxLength
                                },
                                formHelperText: {
                                    style: { position: 'absolute', bottom: -20, left: -10 }
                                },
                                input: {
                                    endAdornment: control.type === "password" && (
                                        <InputAdornment className={`eye-password ${buttonText === "Login" ? "login" : ""}`} position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                        {/* Thêm Tooltip bên cạnh input password */}
                        {control.tooltipTile !== undefined && (
                            <Tooltip
                                title={control.tooltipTile}
                                placement="top"
                            >
                                <IconButton
                                    size="small"
                                    className="tooltip-icon"
                                >
                                    <BiInfoCircle />
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                );
            case "textarea":
                return (
                    <TextField
                        className="input-form"
                        fullWidth
                        variant="outlined"
                        label={control.placeholder}
                        name={control.name}
                        multiline
                        rows={4}
                        value={value}
                        onChange={(e) =>
                            handleInputChange(control.name, e.target.value)
                        }
                        error={hasError}
                        helperText={hasError ? errorMessage : ""}
                    />
                );
            case "select":
                return (
                    <FormControl
                        fullWidth
                        className="select-form"
                        error={hasError}
                    >
                        <InputLabel>{control.placeholder}</InputLabel>
                        <Select
                            value={value}
                            onChange={(e) =>
                                handleInputChange(control.name, e.target.value, control.onChange)
                            }
                            onBlur={() => handleValidation(control.name, value)}
                            onFocus={() => clearError(control.name)} // Khi focus, ẩn lỗi
                        >
                            {control.options?.map((option) => (
                                <MenuItem key={option.id} value={option.label}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {hasError && (
                            <FormHelperText style={{
                                position: 'absolute', bottom: -20, left: -10
                            }}>
                                {errorMessage}
                            </FormHelperText>
                        )}
                    </FormControl>
                );
            default:
                return null;
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            {/* Hiển thị thông báo lỗi nếu có */}
            {isError && (
                <Typography
                    variant="body2"
                    color="error"
                    className="flex items-center mb-5"
                >
                    <BiSolidXCircle className="mr-2" />
                    {isError}
                </Typography>
            )}

            {/* Render các trường nhập liệu */}
            <div className="form-container">
                {formControl.map((control) => (
                    <div key={control.name} className="form-field">
                        {renderInput(control)}
                    </div>
                ))}
            </div>

            {/* Nút submit */}
            <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={!isFormValid || isLoading}
                className="submit-button"
            >
                {isLoading ? <CircularProgress size={24} /> : buttonText}
            </Button>
        </form>
    );
};

export default CommonForm;

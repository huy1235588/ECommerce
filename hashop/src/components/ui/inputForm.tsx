import React, { InputHTMLAttributes } from "react";
import { TextField, Box, InputLabel, SxProps } from "@mui/material";

interface InputFormProps {
    id: string;
    name: string;
    label: string;
    labelOptional?: string;
    type: string;
    placeholder: string;
    value?: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    sx?: SxProps;
    htmlInput?: InputHTMLAttributes<HTMLInputElement>;
    error?: boolean;
    setError: (name:string, value: string) => void;
    errorText?: string;
}

const InputForm: React.FC<InputFormProps> = (
    {
        id,
        name,
        label,
        labelOptional,
        type,
        placeholder,
        value,
        onChange,
        sx,
        htmlInput,
        error,
        setError,
        errorText,
    }
) => {

    return (
        <Box
            sx={{
                width: "100%",
                margin: "1rem 0 0.5rem",
                ...sx,
            }}
        >
            <InputLabel
                htmlFor={id}
                sx={{
                    display: "inline-block",
                    width: "auto",
                    fontWeight: "bold",
                    marginBottom: "0.25rem",
                    marginLeft: "0.125rem",
                }}
            >
                {label}

                {labelOptional !== "" ? (
                    <span
                        style={{
                            color: "gray",
                            marginLeft: "0.25rem",
                        }}
                    >
                        {labelOptional}
                    </span>
                ) : null}

            </InputLabel>

            <TextField
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => {
                    onChange(e);
                    setError(name, "");
                }}
                fullWidth
                error={error}
                helperText={errorText}
                slotProps={{
                    htmlInput: htmlInput,
                    formHelperText: {
                        sx: {
                            position: "absolute",
                            bottom: "-1.5rem",
                            marginLeft: "0.125rem",
                        }
                    }
                }}
            />
        </Box>
    );
};

export default InputForm;
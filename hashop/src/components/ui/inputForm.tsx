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
                onChange={onChange}
                fullWidth
                slotProps={{
                    htmlInput: htmlInput
                }}
            />
        </Box>
    );
};

export default InputForm;
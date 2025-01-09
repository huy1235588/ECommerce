// components/DynamicInput.tsx
"use client";

import React, { useState } from "react";
import { TextField, IconButton, Button, Box, Typography } from "@mui/material";
import { MdDeleteOutline } from "react-icons/md";

interface DynamicInputProps {
    name: string;
    label: string;
    placeholder: string;
    onChange?: (name: string, value: string[]) => void;
}

const DynamicInput: React.FC<DynamicInputProps> = ({
    name,
    label,
    placeholder,
    onChange,
}) => {
    const [inputs, setInputs] = useState<string[]>([""]);

    // Hàm thêm input mới
    const handleAddInput = () => {
        const newInputs = [...inputs, ""];
        setInputs(newInputs);
        onChange?.(name, newInputs);
    };

    // Hàm xóa input
    const handleDeleteInput = (index: number) => {
        const newInputs = inputs.filter((_, i) => i !== index);
        setInputs(newInputs);
        onChange?.(name, newInputs);
    };

    // Hàm xử lý khi input thay đổi
    const handleInputChange = (index: number, value: string) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
        onChange?.(name, newInputs);
    };

    return (
        <Box
            sx={{
                width: "100%",
                margin: "1rem 0 0.5rem",
            }}
        >
            <Typography variant="h6" gutterBottom>
                {label}
            </Typography>

            {inputs.map((input, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <TextField
                        fullWidth
                        placeholder={placeholder}
                        variant="outlined"
                        value={input}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                    <IconButton
                        onClick={() => handleDeleteInput(index)}
                        aria-label="delete"
                        sx={{ ml: 2 }}
                    >
                        <MdDeleteOutline />
                    </IconButton>
                </Box>
            ))}
            <Button
                variant="contained"
                onClick={handleAddInput}
                startIcon={"+"}
            >
                Add new
            </Button>
        </Box>
    );
};

export default DynamicInput;

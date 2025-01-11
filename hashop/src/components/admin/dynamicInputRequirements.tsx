"use client";

import React, { useEffect, useState } from "react";
import { TextField, IconButton, Button, Box, Typography } from "@mui/material";
import { MdDeleteOutline } from "react-icons/md";
import { ProductOS } from "@/types/product";

interface DynamicInputRequirementsProps {
    name: string;
    label: string;
    values: ProductOS;
    onChange?: (name: string, value: ProductOS) => void;
}

const DynamicInputRequirements: React.FC<DynamicInputRequirementsProps> = ({
    name,
    label,
    values,
    onChange,
}) => {
    // State lưu trữ giá trị của input
    const [inputValues, setInputValues] = useState<ProductOS>({
        win: [
            { title: "OS", minimum: "", recommended: "" },
            { title: "Processor", minimum: "", recommended: "" },
            { title: "Memory", minimum: "", recommended: "" },
            { title: "Graphics", minimum: "", recommended: "" },
            { title: "DirectX", minimum: "", recommended: "" },
            { title: "Storage", minimum: "", recommended: "" },
            { title: "Sound Card", minimum: "", recommended: "" },
            { title: "Additional Notes", minimum: "", recommended: "" },
        ],
    });

    // State os hiện tại
    const os = Object.keys(inputValues);

    useEffect(() => {
        if (values) {
            setInputValues(values);
        }
    }, [values]);

    // Hàm xử lý thay đổi giá trị của input
    const handleInputChange = (
        key: keyof ProductOS,
        index: number,
        subKey: "minimum" | "recommended",
        value: string
    ) => {
        setInputValues((prev) => {
            const newInputValues = { ...prev };
            if (newInputValues[key]) {
                newInputValues[key][index] = {
                    ...newInputValues[key][index],
                    [subKey]: value,
                };
            }
            if (onChange) {
                onChange(name, newInputValues);
            }
            return newInputValues;
        });
    };

    // Hàm thêm input mới
    const handleAddInput = () => {
        if (os.length === 1) {
            setInputValues((prev) => {
                const newInputValues = { ...prev };
                newInputValues.mac = [
                    { title: "OS", minimum: "", recommended: "" },
                    { title: "Processor", minimum: "", recommended: "" },
                    { title: "Memory", minimum: "", recommended: "" },
                    { title: "Graphics", minimum: "", recommended: "" },
                    { title: "Storage", minimum: "", recommended: "" },
                    { title: "Sound Card", minimum: "", recommended: "" },
                    { title: "Additional Notes", minimum: "", recommended: "" },
                ];
                return newInputValues;
            });
        }

        else if (os.length === 2) {
            setInputValues((prev) => {
                const newInputValues = { ...prev };
                newInputValues.linux = [
                    { title: "OS", minimum: "", recommended: "" },
                    { title: "Processor", minimum: "", recommended: "" },
                    { title: "Memory", minimum: "", recommended: "" },
                    { title: "Graphics", minimum: "", recommended: "" },
                    { title: "Storage", minimum: "", recommended: "" },
                    { title: "Sound Card", minimum: "", recommended: "" },
                    { title: "Additional Notes", minimum: "", recommended: "" },
                ];
                return newInputValues;
            });
        }
    };

    // Hàm xóa input
    const handleDeleteInput = () => {
        if (os.length === 2) {
            setInputValues((prev) => {
                const newInputValues = { ...prev };
                delete newInputValues.mac;
                return newInputValues;
            });
        }

        else if (os.length === 3) {
            setInputValues((prev) => {
                const newInputValues = { ...prev };
                delete newInputValues.linux;
                return newInputValues;
            });
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                margin: "1rem 0 0.5rem",
            }}
        >
            {Object.entries(inputValues).map(([key, valuesItem]) => (
                <Box
                    key={key}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "1rem",
                            textTransform: "capitalize",
                        }}
                    >
                        {label} ({key === "win" ? "Windows" : key === "mac" ? "MacOS" : "Linux"})

                        {key !== "win" && (
                            <IconButton
                                onClick={() => handleDeleteInput()}
                                aria-label="delete"
                                sx={{ ml: 2 }}
                            >
                                <MdDeleteOutline />
                            </IconButton>
                        )}
                    </Typography>

                    <Box
                        key={key}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            mb: 2,
                            gap: 2,
                        }}
                    >
                        {/* Minimum */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "50%",
                                gap: 2,
                            }}
                        >
                            <Typography
                                variant="body2"
                                gutterBottom
                                style={{
                                    textTransform: "capitalize",
                                }}
                            >
                                Minimum
                            </Typography>

                            {valuesItem.map((item, index) => (
                                <TextField
                                    key={index}
                                    fullWidth
                                    label={item.title}
                                    placeholder={item.title}
                                    variant="outlined"
                                    value={item.minimum}
                                    onChange={(e) => handleInputChange(key as keyof ProductOS, index, "minimum", e.target.value)}
                                />
                            ))}
                        </Box>

                        {/* Recommended */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "50%",
                                gap: 2,
                            }}
                        >
                            <Typography
                                variant="body2"
                                gutterBottom
                                style={{
                                    textTransform: "capitalize",
                                }}
                            >
                                Recommended
                            </Typography>

                            {valuesItem.map((item, index) => (
                                <TextField
                                    key={index}
                                    fullWidth
                                    label={item.title}
                                    placeholder={item.title}
                                    variant="outlined"
                                    value={item.recommended}
                                    onChange={(e) => handleInputChange(key as keyof ProductOS, index, "recommended", e.target.value)}
                                />
                            ))}
                        </Box>
                    </Box>
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

export default DynamicInputRequirements;

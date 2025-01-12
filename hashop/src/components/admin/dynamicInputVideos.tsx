"use client";

import React, { useState } from "react";
import { TextField, IconButton, Button, Box, Typography } from "@mui/material";
import { MdDeleteOutline } from "react-icons/md";
import { ProductVideos } from "@/types/product";

interface DynamicInputVideoProps {
    name: string;
    label: string;
    values?: ProductVideos[];
    onChange?: (name: string, value: ProductVideos[]) => void;
}

const DynamicInputVideo: React.FC<DynamicInputVideoProps> = ({
    name,
    label,
    values,
    onChange,
}) => {
    const [inputs, setInputs] = useState<ProductVideos[]>(values || [{
        thumbnail: "",
        mp4: "",
        webm: "",
    }]);

    // Hàm thêm input mới
    const handleAddInput = () => {
        const newInputs = [...inputs, {
            thumbnail: "",
            mp4: "",
            webm: "",
        }];

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
    const handleInputChange = (
        index: number,
        videoProperties: "thumbnail" | "mp4" | "webm",
        value: string,
    ) => {
        const newInputs = [...inputs];
        newInputs[index][videoProperties] = value;

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

            {(values ?? []).map((value, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {/* Thumbnail */}
                    <TextField
                        fullWidth
                        placeholder="Thumbnail"
                        variant="outlined"
                        value={value.thumbnail}
                        onChange={(e) => handleInputChange(index, "thumbnail", e.target.value)}
                    />

                    {/* Mp4 */}
                    <TextField
                        fullWidth
                        placeholder="Mp4 URL"
                        variant="outlined"
                        value={value.mp4}
                        onChange={(e) => handleInputChange(index, "mp4", e.target.value)}
                    />

                    {/* Webm */}
                    <TextField
                        fullWidth
                        placeholder="Webm URL"
                        variant="outlined"
                        value={value.webm}
                        onChange={(e) => handleInputChange(index, "webm", e.target.value)}
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

export default DynamicInputVideo;

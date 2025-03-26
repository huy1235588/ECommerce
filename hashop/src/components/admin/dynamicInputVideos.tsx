"use client";

import React, { useState } from "react";
import { TextField, IconButton, Button, Box, Typography } from "@mui/material";
import { MdDeleteOutline } from "react-icons/md";
import { ProductMovie } from "@/types/product";

interface DynamicInputVideoProps {
    name: string;
    label: string;
    values?: ProductMovie[];
    onChange?: (name: string, value: ProductMovie[]) => void;
}

const DynamicInputVideo: React.FC<DynamicInputVideoProps> = ({
    name,
    label,
    values,
    onChange,
}) => {
    const [inputs, setInputs] = useState<ProductMovie[]>(values || [{
        id: 0,
        name: "",
        thumbnail: "",
        mp4: {
            480: "",
            max: "",
        },
        webm: {
            "480": "",
            "max": "",
        },
        highlight: false,
        productId: 0,
    }]);

    // Hàm thêm input mới
    const handleAddInput = () => {
        const newInputs = [...inputs, {
            id: 0,
            name: "",
            thumbnail: "",
            mp4: {
                480: "",
                max: "",
            },
            webm: {
                "480": "",
                "max": "",
            },
            highlight: false,
            productId: 0,
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
        videoProperty: "thumbnail" | "mp4" | "webm",
        value: string,
        subProperty?: "480" | "max",
    ) => {
        const newInputs = [...inputs];
        
        if (videoProperty === "thumbnail") {
            newInputs[index].thumbnail = value;
        } else if (videoProperty === "mp4" && subProperty) {
            newInputs[index].mp4[subProperty] = value;
        } else if (videoProperty === "webm" && subProperty) {
            newInputs[index].webm[subProperty] = value;
        }

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
                    {/* Mp4 480p */}
                    <TextField
                        fullWidth
                        placeholder="Mp4 480p URL"
                        variant="outlined"
                        value={value.mp4["480"]}
                        onChange={(e) => handleInputChange(index, "mp4", e.target.value, "480")}
                    />
                    
                    {/* Mp4 max */}
                    <TextField
                        fullWidth
                        placeholder="Mp4 Max URL"
                        variant="outlined"
                        value={value.mp4.max}
                        onChange={(e) => handleInputChange(index, "mp4", e.target.value, "max")}
                    />

                    {/* Webm 480p */}
                    <TextField
                        fullWidth
                        placeholder="Webm 480p URL"
                        variant="outlined"
                        value={value.webm["480"]}
                        onChange={(e) => handleInputChange(index, "webm", e.target.value, "480")}
                    />
                    
                    {/* Webm max */}
                    <TextField
                        fullWidth
                        placeholder="Webm Max URL"
                        variant="outlined"
                        value={value.webm.max}
                        onChange={(e) => handleInputChange(index, "webm", e.target.value, "max")}
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

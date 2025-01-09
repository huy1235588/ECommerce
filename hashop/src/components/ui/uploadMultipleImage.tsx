import React, { useState } from 'react';
import { Box, Typography, IconButton, Card, CardMedia, InputLabel } from '@mui/material';
import { GridDeleteIcon } from '@mui/x-data-grid';
import { FiUpload } from "react-icons/fi";
import "@/styles/components/uploadImage.css";

interface ImageUploaderProps {
    id: string;
    name: string;
    label: string;
    labelOptional?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = (
    {
        id,
        name,
        label,
        labelOptional = "",
    }
) => {
    const [images, setImages] = useState<File[]>([]);
    const [preview, setPreview] = useState<string[]>([]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const fileArray = Array.from(e.target.files);
            setImages(prev => [...prev, ...fileArray]);
            const urlArray = fileArray.map(file => URL.createObjectURL(file));
            setPreview(prev => [
                ...prev,
                ...urlArray
            ]);
        }
    };

    const handleImageRemove = (url: string) => {
        setImages(prev => {
            return prev.filter(file => URL.createObjectURL(file) !== url);
        });
        setPreview((prev) => {
            return prev.filter((item) => item !== url);
        });
    };
    return (
        <Box
            sx={{
                width: "100%",
                margin: "1rem 0 0.5rem",
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

            <Box
                className="image-uploader-container"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'center',
                    border: '1px dashed gray',
                    borderRadius: '8px',
                    width: '100%',
                    margin: '0 auto',
                }}
            >
                <input
                    id={id}
                    name={name}
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    type="file"
                    onChange={handleImageUpload}
                />
                <label
                    htmlFor={id}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        gap: '1rem',
                        padding: '1.55rem 1rem',
                        minHeight: '180px',
                        cursor: 'pointer',
                        userSelect: 'none',
                    }}
                >
                    {preview.length === 0 ? (
                        <>
                            <FiUpload />

                            <Typography
                                variant="caption"
                                sx={{
                                    display: 'block',
                                    mt: 1,
                                    color: 'text.secondary',
                                }}
                            >
                                Min: 1280x720 px, Max: 2560x1440 px, Max Size: 2MB
                            </Typography>
                        </>

                    ) :
                        <>
                            {preview.map((url, index) => (
                                <Card key={index}
                                    onClick={(e) => {
                                        e.preventDefault();
                                    }}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "100%"
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            width: 300,
                                            // height: 150,
                                            objectFit: 'cover',
                                        }}
                                        image={url}
                                        alt={`Image ${index + 1}`}
                                    />

                                    <Box
                                        sx={{
                                            flex: 1,
                                            marginLeft: 1,
                                        }}
                                    >
                                        {/* Tên file */}
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                display: "block",
                                                ml: 1,
                                                mb: 0.5,
                                                color: "text.secondary",
                                                fontSize: "1.5rem",
                                            }}
                                        >
                                            {images[index].name}
                                        </Typography>

                                        {/* Kích cỡ file */}
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                display: "block",
                                                ml: 1,
                                                color: "#666",
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            {/* Chuyển đổi sang KB, MB, GB tuỳ vào độ lớn */}
                                            {images[index].size > 1024 * 1024 ? (
                                                `${(images[index].size / (1024 * 1024)).toFixed(2)} MB`
                                            ) : images[index].size > 1024 ? (
                                                `${(images[index].size / 1024).toFixed(2)} KB`
                                            ) : (
                                                `${images[index].size} B`
                                            )}
                                        </Typography>
                                    </Box>

                                    <IconButton
                                        color="error"
                                        onClick={() => handleImageRemove(url)}
                                        sx={{
                                            height: "100%",
                                            marginRight: 1,
                                        }}
                                    >
                                        <GridDeleteIcon />
                                    </IconButton>
                                </Card>
                            ))}
                        </>
                    }

                </label>
            </Box>
        </Box >

    );
};

export default ImageUploader;

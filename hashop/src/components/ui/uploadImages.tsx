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
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleImageRemove = () => {
        setImage(null);
        setPreview(null);
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
                {!image ? (
                    <Box
                        sx={{
                            width: '100%',
                        }}
                    >
                        <input
                            id={id}
                            name={name}
                            accept="image/*"
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
                                gap: '0.5rem',
                                padding: '1.55rem 1rem',
                                minHeight: '180px',
                                cursor: 'pointer',
                            }}
                        >
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
                        </label>
                    </Box>
                ) : (
                    <Card
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            boxShadow: 3,
                        }}
                    >
                        <CardMedia
                            component="img"
                            sx={{
                                width: '30%',
                                maxHeight: '250px',
                                objectFit: 'cover',
                            }}
                            image={preview!}
                            alt={image.name}
                        />

                        {/* Tên hình ảnh */}
                        <Typography
                            variant="body2"
                            sx={{
                                flex: 1,
                                p: 2,
                                color: 'text.secondary',
                            }}
                        >
                            {image.name}
                        </Typography>

                        <IconButton
                            color="error"
                            onClick={handleImageRemove}
                            sx={{
                                marginRight: '0.5rem',
                            }}
                        >
                            <GridDeleteIcon />
                        </IconButton>
                    </Card>
                )}
            </Box>
        </Box>

    );
};

export default ImageUploader;

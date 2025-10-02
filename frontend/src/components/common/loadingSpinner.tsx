"use client";

import React from "react";
import { Box, CircularProgress } from "@mui/material";

const LoadingSpinner = () => {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
        >
            <CircularProgress />
        </Box>
    );
};

export default LoadingSpinner;

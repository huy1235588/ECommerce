// components/LoadingPage.tsx
import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const LoadingPage: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <CircularProgress size={60} color="primary" />
            <Typography variant="h6" sx={{ marginTop: 2 }}>
                Loading, please wait...
            </Typography>
        </Box>
    );
};

export default LoadingPage;

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Product } from '@/types/product';
import Image from 'next/image';

interface GameDetailsProps {
    game: Product;
}

function GameDetails({ game }: GameDetailsProps) {
    return (
        <Box sx={{ color: 'white', padding: 2 }}>
            <Typography variant="h4">{game.title}</Typography>

            <Box sx={{ marginTop: 1 }}>
                {game.tags?.map((tag, index) => (
                    <Typography
                        key={index}
                        variant="body2"
                        component="span"
                        sx={{ marginRight: 1, backgroundColor: '#3A506B', padding: '2px 6px', borderRadius: 1 }}
                    >
                        {tag}
                    </Typography>
                ))}
            </Box>

            <Box sx={{ marginTop: 2 }}>
                {game.screenshots.map((image, index) => (
                    <Image
                        key={index}
                        src={image}
                        alt={`Screenshot ${index + 1}`}
                        width={640}
                        height={480}
                        style={{
                            width: '100%',
                            marginBottom: '10px',
                            borderRadius: '4px'
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}

export default GameDetails;
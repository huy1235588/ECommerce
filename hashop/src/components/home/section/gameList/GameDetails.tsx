import React from 'react';
import { Box, Typography } from '@mui/material';
import { Product } from '@/types/product';
import Image from 'next/image';

interface GameDetailsProps {
    game: Product;
}

function GameDetails({ game }: GameDetailsProps) {
    return (
        <Box
            sx={{
                color: 'white',
                padding: 2
            }}
        >
            {/* Tên game */}
            <Typography
                variant="h4"
                sx={{
                    color: '#10161b',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                }}
            >
                {game.name}
            </Typography>

            {/* Mô tả */}
            <Typography variant="body2"
                sx={{
                    color: '#263645',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                }}
            >
                {game.short_description}
            </Typography>

            {/* Thể loại */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    height: '24px',
                    marginTop: 1,
                    overflow: 'hidden',
                }}
            >
                {game.tags?.map((tag, index) => (
                    <Typography
                        key={index}
                        variant="body2"
                        component="span"
                        sx={{
                            marginRight: 1,
                            marginBottom: 1,
                            backgroundColor: '#3A506B',
                            padding: '2px 6px',
                            borderRadius: 1,
                            height: 'fit-content',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {tag.name}
                    </Typography>
                ))}
            </Box>

            {/* Hình ảnh */}
            <Box sx={{ marginTop: 2 }}>
                {game.screenshots.map((image, index) => (
                    <Image
                        key={index}
                        src={image.path_thumbnail}
                        alt={`Screenshot ${index + 1}`}
                        width={300}
                        height={156}
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
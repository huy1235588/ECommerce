import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Product } from '@/types/product';
import Image from 'next/image';

interface GameCardProps {
    game: Product;
    isHovered: boolean;
    onHover: (game: Product | null) => void;
}

function GameCard({
    game,
    onHover,
    isHovered,
}: GameCardProps) {
    // Tính giá sau khi giảm giá
    const discountedPrice = game.price && game.discount
        ? (game.price - (game.price * game.discount) / 100).toFixed(2)
        : null;

    return (
        <Card
            onMouseEnter={() => {
                onHover(game);
            }}
            sx={{
                display: 'flex',
                marginBottom: 2,
                transition: 'transform 0.2s',
                background: isHovered
                    ? 'linear-gradient(to bottom, #ADD8E6, #87CEEB)'
                    : '#202d39',
                '&:hover': {
                    transform: 'scale(1.02)',
                },
            }}
        >
            {/* Hình ảnh game */}
            <CardMedia
                component="img"
                height="140"
                image={game.headerImage as string}
                alt={game.title}
                sx={{
                    maxWidth: '300px',
                }}
            />

            {/* Tên game */}
            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    '&:last-child': {
                        paddingBottom: 1,
                    },
                }}

            >
                {/* Tên game */}
                <Typography variant="h6"
                    sx={{
                        color: isHovered ? '#10161b' : '#c7d5e0',
                        fontWeight: 'bold',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {game.title}
                </Typography>

                {/* Platform */}
                {game.platform.map((platform, index) => (
                    <Typography
                        key={index}
                        variant="body2"
                        sx={{
                            color: isHovered ? '#263645' : '#738895',
                            marginRight: '8px',
                        }}
                    >
                        <Image
                            src={`/icons/platforms/${platform}.svg`}
                            alt={platform}
                            width={16}
                            height={16}
                            style={{
                                verticalAlign: 'middle',
                                marginRight: '4px',
                                filter: isHovered ? 'invert(40%)' : 'invert(60%)',
                            }}
                        />
                    </Typography>
                ))}

                {/* Giá tiền */}
                <Typography variant="body1"
                    sx={{
                        marginTop: '8px',
                        color: isHovered ? '#263645' : '#BEEE11'
                    }}
                >
                    {discountedPrice && (
                        <Typography
                            variant="body2"
                            sx={{
                                backgroundColor: '#4c6b22', // Nền vàng cho nhãn giảm giá
                                color: '#BEEE11', // Chữ đen
                                padding: '3px 6px',
                                borderRadius: '4px',
                                display: 'inline-block',
                                marginRight: '8px',
                                fontWeight: 'bold',
                            }}
                        >
                            -{game.discount}%
                        </Typography>
                    )}

                    {/* Giá gốc */}
                    {discountedPrice && (
                        <span
                            style={{
                                textDecoration: 'line-through',
                                color: isHovered ? '#738895' : '#A0A0A0',
                                marginRight: '8px'
                            }}
                        >
                            ${game.price}
                        </span>
                    )}

                    {/* Giá bán */}
                    <span style={{
                        color: isHovered ? '#263645' : discountedPrice ? '#BEEE11' : '#A0A0A0',
                    }}>
                        ${discountedPrice || game.price}
                    </span>
                </Typography>

                {/* Tags */}
                <Box
                    sx={{
                        display: 'flex',
                        marginTop: 'auto',
                        overflow: 'hidden',
                        maxWidth: '100%',
                    }}
                >
                    {game.tags && game.tags?.map((tag, index) => (
                        <Typography
                            key={index}
                            variant="body2"
                            component="span"
                            sx={{
                                marginRight: 1,
                                fontSize: '0.75rem',
                                borderRadius: 1,
                                height: 'fit-content',
                                whiteSpace: 'nowrap',
                                color: isHovered ? '#263645' : '#738895',
                            }}
                        >
                            {tag}
                            {index < game.tags!.length - 1 && ','}
                        </Typography>
                    ))}
                </Box>

            </CardContent>
        </Card>
    );
}

export default GameCard;
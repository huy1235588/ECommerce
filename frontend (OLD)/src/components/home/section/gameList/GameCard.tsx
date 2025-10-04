import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Product } from '@/types/product';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface GameCardProps {
    product: Product;
    isHovered: boolean;
    onHover: (product: Product | null) => void;
}

function GameCard({
    product,
    onHover,
    isHovered,
}: GameCardProps) {
    const router = useRouter();

    return (
        <Card
            onMouseEnter={() => {
                onHover(product);
            }}
            onClick={() => {
                router.push(`/app/${product._id}`);
            }}
            sx={{
                display: 'flex',
                marginBottom: 2,
                marginRight: isHovered ? -2.25 : 0,
                paddingRight: isHovered ? 2.25 : 0,
                transition: 'transform 0.2s',
                cursor: 'pointer',
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
                image={product.header_image as string}
                alt={product.name}
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
                    {product.name}
                </Typography>

                {/* Platform */}
                {Object.keys(product.platform || {})
                    .map((platform, index) => {
                        if (!product.platform?.[platform as keyof typeof product.platform]) {
                            return null;
                        }

                        return (
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
                        )
                    })
                }

                {/* Giá tiền */}
                <Box
                    sx={{
                        marginTop: '8px',
                        color: isHovered ? '#263645' : '#BEEE11'
                    }}
                >
                    {product.price_overview.discount_percent ? (
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
                            -{product.price_overview.discount_percent}%
                        </Typography>
                    ) : null}

                    {/* Giá gốc */}
                    {product.price_overview.discount_percent ? (
                        <span
                            style={{
                                textDecoration: 'line-through',
                                color: isHovered ? '#738895' : '#A0A0A0',
                                marginRight: '8px'
                            }}
                        >
                            {product.price_overview.initial != null
                                ? `$${product.price_overview.initial.toFixed(2)}`
                                : 'Free'
                            }
                        </span>
                    ) : null}

                    {/* Giá bán */}
                    <span style={{
                        color: isHovered ? '#263645' : product.price_overview.discount_percent ? '#BEEE11' : '#A0A0A0',
                    }}>
                        {product.price_overview.final != null
                            ? `$${product.price_overview.final.toFixed(2)}`
                            : 'Free'
                        }
                    </span>
                </Box>

                {/* Tags */}
                <Box
                    sx={{
                        display: 'flex',
                        marginTop: 'auto',
                        overflow: 'hidden',
                        maxWidth: '100%',
                    }}
                >
                    {product.tags && product.tags?.map((tag, index) => (
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
                            {tag.name}
                            {index < product.tags!.length - 1 && ','}
                        </Typography>
                    ))}
                </Box>

            </CardContent>
        </Card>
    );
}

export default GameCard;
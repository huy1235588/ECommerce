import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Product } from '@/types/product';

interface GameCardProps {
    game: Product;
    onHover: (game: Product | null) => void;
}

function GameCard({ game, onHover }: GameCardProps) {
    return (
        <Card
            onMouseEnter={() => onHover(game)}
            sx={{
                backgroundColor: '#2A3F5A',
                color: 'white',
                marginBottom: 2,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' },
            }}
        >
            <CardMedia
                component="img"
                height="140"
                image={game.headerImage as string}
                alt={game.title}
            />

            <CardContent>
                <Typography variant="h6">{game.title}</Typography>

                <Typography variant="body2" sx={{ color: '#A0A0A0' }}>
                    {game.description}
                </Typography>

                <Typography variant="body1">{game.price}</Typography>

                {game.discount && (
                    <Typography variant="body2" sx={{ color: '#00FF00' }}>
                        {game.discount}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

export default GameCard;
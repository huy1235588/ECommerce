import React, { useState } from 'react';
import { Grid2 } from '@mui/material';
import { Product } from '@/types/product';
import GameCard from './GameCard';
import GameDetails from './GameDetails';

interface GameListProps {
    games: Product[];
}

function GameList({ games }: GameListProps) {
    const [hoveredGame, setHoveredGame] = useState<Product | null>(games[0]);

    return (
        <Grid2
            container
            spacing={2}
            sx={{
                backgroundColor: '#1B2838',
                minHeight: '100vh',
                padding: 2
            }}
        >
            <Grid2
                size={{
                    xs: 4,
                    sm: 3,
                    md: 2
                }}
            >
                {games.map((game, index) => (
                    <GameCard
                        key={index}
                        game={game}
                        onHover={setHoveredGame}
                    />
                ))}
            </Grid2>
            <Grid2
                size={{
                    xs: 8,
                    sm: 9,
                    md: 10
                }}
            >
                {hoveredGame &&
                    <GameDetails
                        game={hoveredGame}
                    />
                }
            </Grid2>
        </Grid2>
    );
}

export default GameList;
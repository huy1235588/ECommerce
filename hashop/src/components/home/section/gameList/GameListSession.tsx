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
        <section
            className="game-list-section"
            style={{
                width: '90%',
                margin: 'auto',
                marginTop: '2rem'
            }}
        >

            <Grid2
                container
                spacing={2}
                sx={{
                    backgroundColor: '#1B2838',
                    // minHeight: '100vh',
                    padding: 2
                }}
            >
                {/* Danh sách game */}
                <Grid2
                    size={{
                        xs: 6,
                        sm: 7,
                        md: 8
                    }}
                >
                    {games.map((game, index) => (
                        <GameCard
                            key={index}
                            game={game}
                            isHovered={game === hoveredGame}
                            onHover={setHoveredGame}
                        />
                    ))}
                </Grid2>

                {/* Thông tin chi tiết */}
                <Grid2
                    size={{
                        xs: 6,
                        sm: 5,
                        md: 4
                    }}
                >
                    {hoveredGame &&
                        <GameDetails
                            game={hoveredGame}
                        />
                    }
                </Grid2>
            </Grid2>
        </section>
    );
}

export default GameList;
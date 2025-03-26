'use client'

import React, { useEffect, useState } from 'react';
import { Grid2 } from '@mui/material';
import { Product } from '@/types/product';
import GameCard from './GameCard';
import GameDetails from './GameDetails';

interface GameListProps {
    products: Product[];
}

function GameList({ products }: GameListProps) {
    const [hoveredGame, setHoveredGame] = useState<Product | null>(products[0]);

    useEffect(() => {
        setHoveredGame(products[0]);
    }, [products]);

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
                    {products.map((product, index) => (
                        <GameCard
                            key={index}
                            product={product}
                            isHovered={product === hoveredGame}
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
                    sx={{
                        background: 'radial-gradient(60% 62% at 100% 16%,rgb(191, 226, 250) 0%,rgb(160, 213, 232) 100%)',
                    }}
                >
                    {hoveredGame &&
                        <GameDetails
                            product={hoveredGame}
                        />
                    }
                </Grid2>
            </Grid2>
        </section>
    );
}

export default GameList;
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useRef, useState } from "react";
import { Box, Button, Card, CardMedia, Typography } from "@mui/material";
import Image from "next/image";

interface Slide {
    id: number;
    src: string;
    title: string;
    finalPrice: number;
    basePrice?: number;
    discount?: number;
}

function HomeHighLight() {
    const games: Slide[] = [
        {
            id: 1,
            src: "/image/banner/call-of-duty-black-ops-3.jpg",
            title: "Call of Duty: Black Ops 3",
            finalPrice: 69.99,
        },
        {
            id: 2,
            src: "/image/banner/days-gone.jpg",
            title: "Days Gone",
            finalPrice: 49.99,
        },
        {
            id: 3,
            src: "/image/banner/detroit-become-human_home.jpg",
            title: "Detroit: Become Human",
            basePrice: 39.99,
            finalPrice: 11.99,
            discount: 70,
        },
        {
            id: 4,
            src: "/image/banner/elden-ring.jpg",
            title: "Elden Ring",
            finalPrice: 59.99,
        },
        {
            id: 5,
            src: "/image/banner/RedDeadRedemption2.jpg",
            title: "Red Dead Redemption 2",
            basePrice: 59.99,
            finalPrice: 19.79,
            discount: 67,
        },
        {
            id: 6,
            src: "/image/banner/zenless-zone-zero-1g9cs.jpg",
            title: "Zenless Zone Zero",
            finalPrice: 0,
        },
    ];

    // const swiperRef = useRef<SwiperRef>(null);

    const [hoveredGame, setHoveredGame] = useState<number | null>(null);

    return (
        <section className="home-highlight">
            <h2 className="heading-section">
                Highlights
            </h2>

            <Swiper
                slidesPerView={3}
                spaceBetween={30}
                navigation
            >
                {games.map((game) => (
                    <SwiperSlide key={game.id}>
                        <div
                            className="game-card"
                            onMouseEnter={() => setHoveredGame(game.id)}
                            onMouseLeave={() => setHoveredGame(null)}
                        >
                            <Image
                                className="game-image"
                                src={game.src}
                                alt={game.title}
                                height={450}
                                width={374}
                            />
                            {hoveredGame === game.id && (
                                <div className="hover-overlay">
                                    {/* <video src={game.videoUrl} autoPlay loop muted className="game-video" /> */}
                                    <div className="game-info">
                                        <h3>{game.title}</h3>
                                        <p className="price">
                                            <span className="original-price">{game.basePrice}</span>
                                            <span className="discount-price">{game.finalPrice}</span>
                                        </p>
                                        <p className="discount">{game.discount}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );

    // return (
    //     <Box className="home-highlight" sx={{ position: 'relative', overflow: 'hidden' }}>
    //         <h2>
    //             Highlights
    //         </h2>

    //         <Swiper
    //             ref={swiperRef}
    //             modules={[Navigation, Pagination, A11y, Autoplay]}
    //             lazyPreloadPrevNext={5}
    //             spaceBetween={20}
    //             slidesPerView={3}
    //             centeredSlides={true}
    //             loop={true}
    //             navigation={{
    //                 nextEl: '.swiper-button-next',
    //                 prevEl: '.swiper-button-prev',
    //             }}
    //             pagination={{ clickable: true }}
    //             autoplay={{ delay: 4000, disableOnInteraction: false }}
    //             className="swiper-container"
    //         >
    //             {slides.map((slide, index) => (
    //                 <SwiperSlide key={index}>
    //                     <Card
    //                         sx={{
    //                             width: '100%',
    //                             height: '86vh',
    //                             position: 'relative',
    //                             backgroundColor: 'black',
    //                         }}
    //                     >
    //                         <CardMedia
    //                             component="img"
    //                             height="100%"
    //                             image={slide.src}
    //                             alt={slide.title}
    //                             sx={{ objectFit: 'cover', objectPosition: 'center' }}
    //                         />
    //                         <Box
    //                             sx={{
    //                                 position: 'absolute',
    //                                 bottom: 0,
    //                                 left: 0,
    //                                 right: 0,
    //                                 background: 'rgba(0, 0, 0, 0.5)',
    //                                 color: 'white',
    //                                 padding: 2,
    //                                 display: 'flex',
    //                                 justifyContent: 'space-between',
    //                                 alignItems: 'center',
    //                             }}
    //                         >
    //                             <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
    //                                 {slide.title}
    //                             </Typography>
    //                             <Box display="flex" alignItems="center">
    //                                 {slide.discount && (
    //                                     <Box
    //                                         sx={{
    //                                             backgroundColor: 'green',
    //                                             color: 'lime',
    //                                             borderRadius: 1,
    //                                             padding: '0.5rem',
    //                                             marginRight: 1,
    //                                         }}
    //                                     >
    //                                         -{slide.discount}%
    //                                     </Box>
    //                                 )}
    //                                 <Box>
    //                                     {slide.basePrice && (
    //                                         <Typography
    //                                             variant="body2"
    //                                             sx={{ textDecoration: 'line-through', color: 'gray' }}
    //                                         >
    //                                             ${slide.basePrice}
    //                                         </Typography>
    //                                     )}
    //                                     <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
    //                                         {slide.finalPrice === 0 ? 'Free to Play' : `$${slide.finalPrice}`}
    //                                     </Typography>
    //                                 </Box>
    //                                 <Button
    //                                     variant="contained"
    //                                     color="primary"
    //                                     sx={{ marginLeft: 2 }}
    //                                     onClick={(e) => e.preventDefault()}
    //                                 >
    //                                     Add to Cart
    //                                 </Button>
    //                             </Box>
    //                         </Box>
    //                     </Card>
    //                 </SwiperSlide>
    //             ))}
    //         </Swiper>

    //         {/* Navigation Buttons */}
    //         <Button
    //             className="swiper-button-prev"
    //             sx={{
    //                 position: 'absolute',
    //                 top: '50%',
    //                 left: 0,
    //                 transform: 'translateY(-50%)',
    //                 zIndex: 10,
    //             }}
    //         >
    //             <FaAngleLeft />
    //         </Button>
    //         <Button
    //             className="swiper-button-next"
    //             sx={{
    //                 position: 'absolute',
    //                 top: '50%',
    //                 right: 0,
    //                 transform: 'translateY(-50%)',
    //                 zIndex: 10,
    //             }}
    //         >
    //             <FaAngleRight />
    //         </Button>
    //     </Box>
    // );
}

export default HomeHighLight;

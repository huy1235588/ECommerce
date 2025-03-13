import { Product } from '@/types/product';
import { Typography, Button, Chip, Grid2, Box } from '@mui/material';
import './style.css';
import dayjs from 'dayjs';
import Image from 'next/image';
import { convertCurrency } from '@/utils/currencyConverter';
import HighlightPlayer from '@/components/app/hightlighPlayer';
import axios from "@/config/axios";
import axiosLib from "axios";
import { headers } from 'next/headers';
import AreaDescription from '@/components/app/areaDescription';
import { use } from 'react';

// Khởi tạo product ban đầu
const initialProduct: Product = {
    _id: -1,
    name: '',
    type: '',
    short_description: '',
    price_overview: {
        currency: '',
        initial: 0,
        final: 0,
        discount_percent: 0,
    },
    release_date: {
        date: dayjs(),
        coming_soon: false,
    },
    developers: [],
    publishers: [],
    platform: {
        windows: false,
        mac: false,
        linux: false,
    },
    genres: [],
    tags: [],
    categories: [],
    header_image: "",
    screenshots: [],
    movies: [],
};

// Định nghĩa interface cho mỗi ngôn ngữ
interface Language {
    name: string;
    interface: boolean;
    fullAudio: boolean;
    subtitles: boolean;
}

// Hàm lấy thông tin sản phẩm
const getProduct = async () => {
    try {
        // Lấy headers
        const headersList = await headers();
        const pathname = headersList.get('referer');

        // Lấy id sản phẩm từ url
        const id = pathname?.split('/').pop();

        // Các field cần lấy
        const fieldProduct = `
                 _id
                name
                short_description
                detailed_description
                about_the_game
                price_overview {
                    initial
                    final
                    discount_percent
                    currency
                }
                release_date {
                    date
                }
                developers
                publishers
                header_image
                screenshots {
                    path_thumbnail
                }
                movies {
                    thumbnail
                    mp4 {
                        _480
                        max
                    }
                    webm {
                        _480
                        max
                    }
                }
                platform {
                    windows
                    mac
                    linux
                }
                 tags {
                    id
                    name
                }
                categories {
                    id
                    description
                }
                pc_requirements {
                    type
                    minimum
                    recommended
                }
                mac_requirements {
                    type
                    minimum
                    recommended
                }
                linux_requirements {
                    type
                    minimum
                    recommended
                }
                supported_languages
                    achievements {
                    total
                    highlighted {
                        name
                        path
                    }
                }
                package_groups {
                    name
                    title
                    description
                    selection_text
                    save_text
                    display_type
                    is_recurring_subscription
                    subs {
                        packageId
                        percent_savings_text
                        percent_savings
                        option_text
                        option_description
                        can_get_free_license
                        is_free_license
                        price_in_cents_with_discount
                    }
                }
                achievements {
                    total
                    highlighted {
                        name
                        path
                    }
                }
            `;

        // Lấy tối đa 5 achievements highlighted
        const slice = {
            achievements: {
                highlighted: {
                    limit: 4
                }
            }
        }

        // Gửi request lên server
        const response = await axios.post(
            '/graphql',
            {
                query: `query GetProductById($id: Int!, $slice: String) {
                               product(id: $id, slice: $slice) {
                                   ${fieldProduct}
                               }
                           }`,
                variables: {
                    id: parseInt(id as string),
                    slice: JSON.stringify(slice),
                }
            }
        );

        // Lấy sản phẩm từ kết quả
        const fetchedProducts = await response.data.data.product;

        if (fetchedProducts.price_overview && fetchedProducts.price_overview.currency) {
            if (fetchedProducts.price_overview.final !== null) {
                // Chuyển đổi giá tiền cuối cùng sang USD
                fetchedProducts.price_overview.final = convertCurrency(
                    fetchedProducts.price_overview.final / 100,
                    fetchedProducts.price_overview.currency,
                    'USD'
                );
            }

            // Chuyển đổi giá tiền gốc sang USD
            fetchedProducts.price_overview.initial = convertCurrency(
                fetchedProducts.price_overview.initial / 100,
                fetchedProducts.price_overview.currency,
                'USD'
            );
        }

        return fetchedProducts;

    } catch (error) {
        if (axiosLib.isAxiosError(error) && error.response) {
            // Xử lý lỗi GraphQL
            if (error.response?.data?.errors) {
                console.log({
                    message: error.response.data.message,
                    errors: error.response.data.errors
                });
            }
        }
    }
};

function ProductDetailPage() {
    // Khai báo state
    let product: Product = initialProduct;

    // Gọi hàm lấy thông tin sản phẩm
    product = use(getProduct());

    // Parse ngôn ngữ hỗ trợ
    const parseSupportedLanguages = (supportedLanguages: string): Language[] => {
        const languages: Language[] = [];
        const languageEntries = supportedLanguages.split(', ');

        languageEntries.forEach(entry => {
            const hasFullAudio = entry.includes('<strong>*</strong>');
            const name = entry.replace('<strong>*</strong>', '').trim();
            languages.push({
                name,
                interface: true,
                fullAudio: hasFullAudio,
                subtitles: true,
            });
        });

        return languages;
    };

    return (
        <Box sx={{
            padding: 2,
            minHeight: '100vh',
            width: '90%',
            margin: '20px auto',
        }}>
            {/* Tên */}
            <Typography
                variant="h2"
                sx={{
                    color: '#fff',
                    textShadow: '0 0 10px #ff0',
                    marginBottom: 2,
                }}
            >
                {product.name}
            </Typography>

            {/* Nội dung trang */}
            <Grid2 container spacing={2}>
                {/* Cột trái */}
                <HighlightPlayer
                    screenshots={product.screenshots}
                    movies={product.movies}
                />

                {/* Cột phải */}
                <Grid2
                    size={{
                        xs: 12,
                        md: 4,
                    }}
                >
                    {/* Hình ảnh header */}
                    <Image
                        src={product.header_image
                            ? product.header_image
                            : 'https://placehold.co/343x160/000/000/png'
                        }
                        alt="Product"
                        width={343}
                        height={160}
                        priority
                    />

                    {/* Mô tả trò chơi */}
                    <Typography variant="body1" sx={{ color: '#fff', marginTop: 2 }}>
                        {product.short_description}
                    </Typography>

                    {/* Đánh giá */}
                    <Typography variant="body2" sx={{ color: 'green', marginTop: 2 }}>
                        Recent Reviews: Very Positive (6,319)
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'green' }}>
                        All Reviews: Very Positive (748,816)
                    </Typography>

                    {/* Thông tin phát hành */}
                    <Typography variant="body2" sx={{ color: '#fff', marginTop: 2 }}>
                        Release Date: {dayjs(product.release_date.date).format('DD/MM/YYYY')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                        Developer: {product.developers?.join(', ')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                        Publisher: {product.publishers?.join(', ')}
                    </Typography>

                    {/* Thẻ tag */}
                    <Grid2 container
                        spacing={1}
                        sx={{
                            marginTop: 2,
                            height: '78px',
                            overflow: 'hidden',
                        }}
                    >
                        {product.tags?.map((tag) => (
                            <Grid2
                                key={tag.id}
                            >
                                <Chip
                                    label={tag.name}
                                    sx={{ backgroundColor: '#1976d2', color: '#fff', '&:hover': { backgroundColor: '#115293' } }}
                                    clickable
                                />
                            </Grid2>
                        ))}
                    </Grid2>
                </Grid2>
            </Grid2>

            {/* Thông tin chi tiết */}
            <Grid2 container spacing={2}>
                {/*  */}
                <Grid2
                    size={{
                        xs: 12,
                        md: 8,
                    }}
                    sx={{
                        marginTop: 2,
                    }}
                >
                    {/* Tiêu đề */}
                    <Box sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#333',
                        padding: '16px',
                        paddingBottom: '26px',
                        marginBottom: 2,
                        borderRadius: '5px',
                        color: '#fff',
                    }}>
                        {/* Tiêu đề */}
                        <Typography variant="h5" sx={{ color: '#fff' }}>
                            Buy {product.name}
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
                                            color: '#fff',
                                            marginRight: '8px',
                                        }}
                                    >
                                        <Image
                                            src={`/icons/platforms/${platform}.svg`}
                                            alt={platform}
                                            width={20}
                                            height={20}
                                            style={{
                                                verticalAlign: 'middle',
                                                marginRight: '4px',
                                                filter: 'invert(80%)',
                                            }}
                                        />
                                    </Typography>
                                )
                            })
                        }

                        {/* Giá tiền */}
                        <Box sx={{
                            position: 'absolute',
                            right: '16px',
                            bottom: '-17px',
                        }}>
                            {/* Giá gốc */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#000',
                                height: '36px',
                                verticalAlign: 'bottom',
                            }}>
                                {product.price_overview.discount_percent ? (
                                    <>
                                        {/* Nhãn giảm giá */}
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                backgroundColor: '#4c6b22', // Nền vàng cho nhãn giảm giá
                                                color: '#BEEE11', // Chữ đen
                                                height: '36px',
                                                padding: '0 6px',
                                                borderRadius: '4px',
                                                display: 'inline-block',
                                                marginRight: '8px',
                                                fontWeight: 'bold',
                                                fontSize: '25px',
                                            }}
                                        >
                                            -{product.price_overview.discount_percent}%
                                        </Typography>

                                        {/* Giá tiền */}
                                        <Box
                                            sx={{
                                                position: 'relative',
                                            }}
                                        >
                                            {/* Giá gốc */}
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    top: '2px',
                                                    left: 'auto',
                                                    right: '4px',
                                                    textDecoration: 'line-through',
                                                    color: '#A0A0A0',
                                                    marginRight: '8px',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                {product.price_overview.initial != null
                                                    ? `$${product.price_overview.initial.toFixed(2)}`
                                                    : 'Free'
                                                }
                                            </span>

                                            {/* Giá bán */}
                                            <Typography variant="body1" sx={{
                                                padding: '16px 10px 4px 6px',
                                                lineHeight: '18px',
                                                fontSize: '16px',
                                                color: '#BEEE11',
                                            }}>
                                                {product.price_overview.final != null
                                                    ? `$${product.price_overview.final.toFixed(2)}`
                                                    : 'Free'
                                                }
                                            </Typography>
                                        </Box>
                                    </>
                                ) : (
                                    < Typography variant="body1" sx={{
                                        color: '#fff',
                                        padding: '8px 12px',
                                    }}>
                                        {product.price_overview.final != null
                                            ? `$${product.price_overview.final.toFixed(2)}`
                                            : 'Free'
                                        }
                                    </Typography>
                                )}

                                {/* Nút thêm vào giỏ hàng */}
                                <Button variant="contained" color="success">
                                    Add to Cart
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    {/* Mô tả chi tiết */}
                    <AreaDescription
                        detailed_description={product.detailed_description || ""}
                        about_the_game={product.about_the_game || ""}
                    />

                    {/* Bảng cấu hình */}
                    <div className='product-sysReq-container'>
                        <h2 className='product-sysReq-title'>
                            System Requirements
                        </h2>

                        <div className="sysReq_contents">
                            <div className="game_area_sys_req sysReq_content active" data-os="win">
                                <div className="game_area_sys_req_leftCol">
                                    <div className="product-detail-area"
                                        dangerouslySetInnerHTML={{ __html: product.pc_requirements?.minimum || "" }}
                                    />
                                </div>
                                <div className="game_area_sys_req_rightCol">
                                    <div className="product-detail-area"
                                        dangerouslySetInnerHTML={{ __html: product.pc_requirements?.recommended || "" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid2>

                {/* Thông tin */}
                <Grid2
                    size={{
                        xs: 12,
                        md: 4,
                    }}
                    sx={{
                        marginTop: 2,
                    }}
                >
                    {/* Features */}
                    <div className="product-features-container">
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                            Features
                        </Typography>
                        <div className='product-features-list'>
                            {product.categories?.map((feature, index) => (
                                <a className='product-features-item'
                                    href="#"
                                    key={index}
                                >
                                    <div className='product-features-icon'>
                                        <Image
                                            src={`https://store.fastly.steamstatic.com/public/images/v6/ico/ico_singlePlayer.png`}
                                            alt={feature.description}
                                            width={26}
                                            height={16}
                                        />
                                    </div>
                                    <div className='product-features-text'>
                                        {feature.description}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Languages */}
                    <div className="product-languages-container">
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                            Languages
                        </Typography>
                        <div className='product-languages-list'>
                            <table className='product-languages-table'>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th className='checkCol'>Interface</th>
                                        <th className='checkCol'>Full Audio</th>
                                        <th className='checkCol'>Subtitles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {product.supported_languages && parseSupportedLanguages(product.supported_languages)
                                        .map((language, index) => (
                                            <tr key={index}>
                                                <td>{language.name}</td>
                                                <td className='checkCol'>
                                                    {language.interface ? '✔' : ''}
                                                </td>
                                                <td className='checkCol'>
                                                    {language.fullAudio ? '✔' : ''}
                                                </td>
                                                <td className='checkCol'>
                                                    {language.subtitles ? '✔' : ''}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="product-achievements-container">
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                            Achievements
                        </Typography>
                        <div className='product-achievements-list'>
                            {product.achievements?.highlighted.map((achievement, index) => (
                                <div className='product-achievements-item'
                                    key={index}
                                >
                                    <Image
                                        src={achievement.path}
                                        alt={achievement.name}
                                        width={64}
                                        height={64}
                                    />
                                </div>
                            ))}

                            {/* Nút xem thêm */}
                            <a className='product-achievements-view-all'
                                href="#">
                                View all {product.achievements?.total}
                            </a>
                        </div>
                    </div>
                </Grid2>
            </Grid2>
        </Box >
    );
};

export default ProductDetailPage;
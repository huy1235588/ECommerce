import HomeAside from "@/components/home/aside/aside";
import HomeHeader from "@/components/home/header";
import NavigationBar from "@/components/home/navigation/navigationBar";
import GameList from "@/components/home/section/gameList/GameListSession";
import "@/styles/home.css?v=1";
import { Product } from "@/types/product";
import { convertCurrency } from "@/utils/currencyConverter";
import axios from "@/config/axios";
import axiosLib from "axios";


export default async function Home() {
    let products: Product[] = [];

    // Hàm lấy danh sách sản phẩm
    const getProducts = async () => {
        try {
            // Các trường cần lấy
            const fields: string = `
                _id
                name
                price_overview {
                    initial
                    final
                    discount_percent
                    currency
                }
                release_date {
                    date
                }
                header_image
                short_description
                screenshots {
                    path_thumbnail
                }
                platform {
                    windows
                    mac
                    linux
                }
                tags {
                    name
                }
            `

            // Cắt lấy 3 screenshot đầu tiên và 6 tag đầu tiên
            const slice = {
                // Lấy 3 screenshot đầu tiên
                screenshots: {
                    $slice: 6
                },
                // Lấy 6 tag đầu tiên
                tags: {
                    $slice: 5
                }
            }

            const page = 1;
            const limit = 7;
            const sortColumn = null;
            const sortOrder = null;
            const query = null;

            const response = await axios.post(
                '/graphql',
                {
                    query: `query PaginatedProducts(
                        $page: Int!
                        $limit: Int!
                        $sortColumn: String
                        $sortOrder: String
                        $query: String
                        $slice: String
                    ) {
                        paginatedProducts(
                            page: $page
                            limit: $limit
                            sortColumn: $sortColumn
                            sortOrder: $sortOrder
                            query: $query
                            slice: $slice
                        ) {
                            products {
                                ${fields}
                            }
                            totalProducts
                        }
                    }`,
                    variables: {
                        page,
                        limit,
                        sortColumn: sortColumn || null,
                        sortDirection: sortOrder || null,
                        query: query || null,
                        slice: JSON.stringify(slice)
                    }
                }
            );

            const fetchedProduct = response.data.data.paginatedProducts.products;

            // Chuyển đổi giá tiền cuối cùng sang USD
            fetchedProduct.forEach((product: Product) => {
                if (product.price_overview && product.price_overview.currency) {
                    // Chuyển đổi giá tiền cuối cùng sang USD
                    product.price_overview.final = convertCurrency(
                        product.price_overview.final / 100,
                        product.price_overview.currency,
                        'USD'
                    );

                    // Chuyển đổi giá tiền gốc sang USD
                    product.price_overview.initial = convertCurrency(
                        product.price_overview.initial / 100,
                        product.price_overview.currency,
                        'USD'
                    );
                }
            });

            // Lưu danh sách sản phẩm
            products = fetchedProduct;

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
    }

    // Lấy danh sách sản phẩm
   await getProducts();

    return (
        <div className="root">
            {/* Header */}
            <HomeHeader
                active="ha"
            />

            {/* Navigation */}
            <NavigationBar />

            {/* Aside */}
            <HomeAside />

            <main>
                {/* Discover Section */}
                {/* <DiscoverSection /> */}

                {/* Release Section */}
                {/* <ReleasesSection /> */}

                {/* Game list Session */}
                <GameList
                    products={products}
                />
            </main>
        </div>
    );
}

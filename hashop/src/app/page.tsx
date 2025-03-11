'use client'

import HomeAside from "@/components/home/aside/aside";
import HomeHeader from "@/components/home/header";
import NavigationBar from "@/components/home/navigation/navigationBar";
import DiscoverSection from "@/components/home/section/discover/discoverSection";
import GameList from "@/components/home/section/gameList/GameListSession";
import ReleasesSection from "@/components/home/section/release/releaseSection";
import { checkAuthUser } from "@/store/auth";
import { paginatedProducts } from "@/store/product";
import { AppDispatch } from "@/store/store";
import "@/styles/home.css?v=1";
import { Product } from "@/types/product";
import { convertCurrency } from "@/utils/currencyConverter";
import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";


export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const [sampleGames, setSampleGames] = useState<Product[]>([]);

    useEffect(() => {
        dispatch(checkAuthUser());

        // Hàm lấy danh sách sản phẩm
        const getProducts = async () => {
            try {
                // Các trường cần lấy
                const field: string = `
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

                // Lấy danh sách sản phẩm
                const resultAction = await dispatch(paginatedProducts({
                    page: 1,
                    limit: 7,
                    fields: field,
                    slice: JSON.stringify(slice),
                }));

                // Lấy danh sách sản phẩm thành công
                if (resultAction.meta.requestStatus === "fulfilled") {
                    const fetchedProduct = unwrapResult(resultAction).data.paginatedProducts.products;

                    // Chuyển đổi giá tiền cuối cùng sang USD
                    fetchedProduct.forEach((product) => {
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

                    // Lưu danh sách sản phẩm vào state
                    setSampleGames(fetchedProduct);
                }

            } catch (error) {
                console.log(error);
            }
        }
        // Lấy danh sách sản phẩm
        getProducts();

    }, [dispatch]);


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
                <DiscoverSection />

                {/* Release Section */}
                <ReleasesSection />

                {/* Game list Session */}
                <GameList
                    games={sampleGames}
                />
            </main>
        </div>
    );
}

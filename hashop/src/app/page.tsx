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
                // Tạo type alias cho các field hợp lệ
                type ProductField = keyof Product;

                // Các trường cần lấy
                const field: ProductField[] = [
                    "productId",
                    "title",
                    "price",
                    "discount",
                    "releaseDate",
                    "headerImage",
                    "description",
                    "tags",
                    "screenshots"
                ];

                const query = {
                    // Lấy 3 screenshot đầu tiên
                    screenshots: {
                        $size: 4
                    }
                }

                // Lấy danh sách sản phẩm
                const resultAction = await dispatch(paginatedProducts({
                    page: 1,
                    limit: 10,
                    fields: field,
                    query: JSON.stringify(query)
                }));

                // Lấy danh sách sản phẩm thành công
                if (resultAction.meta.requestStatus === "fulfilled") {
                    const products = unwrapResult(resultAction).data.paginatedProducts.products;
                    setSampleGames(products);
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

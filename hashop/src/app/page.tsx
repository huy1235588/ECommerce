'use client'

import HomeAside from "@/components/home/aside/aside";
import HomeHeader from "@/components/home/header";
import NavigationBar from "@/components/home/navigation/navigationBar";
import DiscoverSection from "@/components/home/section/discover/discoverSection";
import ReleasesSection from "@/components/home/section/release/releaseSection";
import { checkAuthUser } from "@/store/auth";
import { AppDispatch } from "@/store/store";
import "@/styles/home.css?v=1";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(checkAuthUser());
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
            </main>
        </div>
    );
}

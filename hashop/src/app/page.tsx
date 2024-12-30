'use client'

import HomeHeader from "@/components/home/header";
import NavigationBar from "@/components/home/navigation/navigationBar";
import { checkAuthUser } from "@/store/auth";
import { AppDispatch } from "@/store/store";
import "@/styles/home.css";
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

            <main>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
                <p>main</p>
            </main>
        </div>
    );
}

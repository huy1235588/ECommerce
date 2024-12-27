'use client'

import HomeHeader from "@/components/home/header";
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
            <HomeHeader
                active="ha"
            />
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

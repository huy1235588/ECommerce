"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ErrorEye() {
    const pupilRef = useRef<HTMLDivElement | null>(null);
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const eye = pupilRef.current?.parentElement;
            if (!eye || !pupilRef.current) return;

            const rect = eye.getBoundingClientRect();
            const eyeCenterX = rect.left + rect.width / 2;
            const eyeCenterY = rect.top + rect.height / 2;

            const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
            const maxOffset = rect.width / 6;

            const pupilX = Math.cos(angle) * maxOffset;
            const pupilY = Math.sin(angle) * maxOffset;

            pupilRef.current.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 150);
        }, Math.random() * 2000 + 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-[90px] h-[90px] md:w-[110px] md:h-[110px] overflow-hidden">
            <div className="absolute inset-0 bg-white rounded-full flex items-center justify-center">
                <div
                    ref={pupilRef}
                    className="rounded-full transition-transform duration-75 ease-linear"
                    style={{ width: 30, height: 30, backgroundColor: "#000" }}
                />
            </div>

            <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ boxShadow: "0 0 20px 6px rgba(0,142,236,0.06)" }}
            />

            <AnimatePresence>
                {isBlinking && (
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 bg-[#242424] origin-top"
                        style={{ borderRadius: "50%" }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

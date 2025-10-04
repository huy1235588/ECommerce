"use client";
import Link from "next/link";
import ErrorEye from "@/components/Error";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#242424] text-white flex flex-col items-center justify-center p-6">

            {/* Eyes */}

            <div className="flex flex-col items-center gap-8 mb-10">
                <div className="flex gap-6 md:gap-10">
                    <ErrorEye />
                    {/* 404 with hover shake */}
                    <motion.div
                        className="text-[6rem] md:text-[8rem] font-black select-none leading-none cursor-default"
                        whileHover={{
                            rotate: [0, -5, 5, -3, 3, 0],
                            transition: { duration: 0.6 },
                        }}
                    >
                        404
                    </motion.div>
                    <ErrorEye />
                </div>

                {/* Bottom: Text + button */}
                <div className="max-w-md text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Page not found</h1>
                    <p className="text-sm md:text-base text-gray-300 mb-6">
                        Sorry, we couldn’t find the page you’re looking for.
                        It might have been removed, renamed, or doesn’t exist anymore.
                    </p>

                    {/* Button with pulse glow */}
                    <motion.div
                        animate={{
                            boxShadow: [
                                "0 0 0px rgba(61,106,255,0.0)",
                                "0 0 25px 8px rgba(61,106,255,0.6)",
                                "0 0 0px rgba(61,106,255,0.0)",
                            ],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut",
                        }}
                        className="inline-block rounded-md"
                    >
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 rounded-md border border-[#3d6aff] text-sm font-semibold uppercase tracking-wider
                       bg-transparent hover:bg-[#3d6aff] transition-colors duration-200"
                        >
                            Go to homepage
                        </Link>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

import { useEffect, useState } from "react";

function NotFound() {
    const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    });

    return (
        <main className="w-full h-full bg-neutral-800 text-violet-200 font-serif">
            <a href="/shop" className="absolute top-6 left-6 flex items-center justify-center w-24 h-11 z-10">
                <img src="logo.png" className="w-24" alt="logo" />
            </a>
            <article className="flex items-center justify-center w-full h-dvh text-6xl text-center">
                <p>
                    <p className="text-pink-800 text-8xl">Page doesn't exists</p>
                    <span>
                        {currentDateTime.toLocaleDateString()} {currentDateTime.toLocaleTimeString()}
                    </span>
                </p>
            </article>
        </main>
    );
}

export default NotFound;
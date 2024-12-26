'use client';

import { useEffect, useState } from "react";
import styles from "@/styles/not-found.module.css";
import Image from "next/image";

function NotFound() {
    const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <main className={styles.main}>
            <a href="/" className={styles.logo}>
                <Image
                    src="/logo/logo.png"
                    className={styles.logoImage}
                    alt="logo"
                    width={100}
                    height={45}
                />
            </a>
            <article className={styles.article}>
                <div>
                    <p className={styles.errorText}>Page doesn&apos;t exist</p>
                    <span>
                        {currentDateTime.toLocaleDateString()} {currentDateTime.toLocaleTimeString()}
                    </span>
                </div>
            </article>
        </main>
    );
}

export default NotFound;

import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    loading: 'lazy' | 'eager';
    placeholder?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, loading, placeholder }) => {
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 } // Adjust the threshold if needed
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    return (
        <img
            ref={imgRef}
            src={isInView ? src : placeholder || ''}
            alt={alt}
            loading={loading}
            className={`select-none drag ${!hasLoaded ? "opacity-50" : "opacity-100"} transition-opacity duration-300`}
            onLoad={() => setHasLoaded(true)} // Đánh dấu khi ảnh đã tải xong
        />
    );
};

export default LazyImage;
import { useEffect, useRef } from "react";

function HomeAside() {

    const videoRef = useRef<HTMLVideoElement | null>(null);

    const videoUrl = "/video/aside/aside.mp4";

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            // Đảm bảo video tự động phát khi trang tải
            video.play().catch((error) => {
                console.error("Autoplay bị chặn:", error);
            });
        }
    }, []);

    return (
        <div className="video-container">
            <video
                ref={videoRef}
                loop
                muted
                playsInline
                preload="none"
                className="bg-video"
            >
                <source
                    src={videoUrl}
                    type="video/webm"
                />
                <source
                    src={videoUrl}
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}

export default HomeAside;

// import { useRef } from "react";

function HomeAside() {
    // const videoRef = useRef<HTMLVideoElement | null>(null);

    const videoUrl = "/video/aside/aside.mp4";

    return (
        <div className="video-container">
            <video
                src={videoUrl || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                loop
                muted
                playsInline
                autoPlay
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

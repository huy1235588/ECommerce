import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Slider, styled } from '@mui/material';
import { BiPause, BiPlay } from 'react-icons/bi';
import { FaVolumeOff, FaVolumeUp } from 'react-icons/fa';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';

interface VideoPlayerProps {
    src: string;
    poster?: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    onEnded?: () => void;
}

// Container for the video player
const VideoContainer = styled(Box)(() => ({
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    overflow: 'hidden',
}));

// Overlay for the controls with smooth transition on hover
const ControlsOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
    '&:hover': {
        opacity: 1,
    },
}));

// Row for aligning individual control elements
const ControlsRow = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    src,
    poster,
    autoPlay = false,
    muted = false,
    loop = false,
    onEnded,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(autoPlay);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(muted ? 0 : 1);
    const [isMuted, setIsMuted] = useState(muted);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
        };

        const handleEnded = () => {
            setPlaying(false);
            if (onEnded) onEnded();
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleEnded);
        };
    }, [onEnded]);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;
        if (playing) {
            video.pause();
        } else {
            video.play();
        }
        setPlaying(!playing);
    };

    const handleVolumeChange = (event: Event, newValue: number | number[]) => {
        const newVolume = Array.isArray(newValue) ? newValue[0] : newValue;
        setVolume(newVolume);
        const video = videoRef.current;
        if (video) {
            video.volume = newVolume;
            setIsMuted(newVolume === 0);
        }
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleProgressChange = (event: Event, newValue: number | number[]) => {
        const newTime = Array.isArray(newValue) ? newValue[0] : newValue;
        const video = videoRef.current;
        if (video) {
            video.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const toggleFullscreen = () => {
        const container = videoRef.current?.parentElement;
        if (!container) return;
        if (!isFullscreen) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            }
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    return (
        <VideoContainer>
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                autoPlay={autoPlay}
                muted={isMuted}
                loop={loop}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <ControlsOverlay>
                <Slider
                    size="small"
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={handleProgressChange}
                    sx={{ color: 'white' }}
                />
                <ControlsRow>
                    <IconButton onClick={togglePlay} sx={{ color: 'white' }}>
                        {playing ? <BiPause /> : <BiPlay />}
                    </IconButton>
                    <IconButton onClick={toggleMute} sx={{ color: 'white' }}>
                        {isMuted || volume === 0 ? <FaVolumeOff /> : <FaVolumeUp />}
                    </IconButton>
                    <Slider
                        size="small"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={handleVolumeChange}
                        sx={{ width: 100, color: 'white' }}
                    />
                    <IconButton onClick={toggleFullscreen} sx={{ color: 'white', marginLeft: 'auto' }}>
                        {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
                    </IconButton>
                </ControlsRow>
            </ControlsOverlay>
        </VideoContainer>
    );
};

export default VideoPlayer;

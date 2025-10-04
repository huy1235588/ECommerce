import React from "react";

type LoadingProps = {
    /** 'sm' | 'md' | 'lg' or numeric px value */
    size?: "sm" | "md" | "lg" | number;
    message?: string;
    /** visual style preset */
    variant?: "default" | "quantum" | "aurora" | "cosmic" | "minimal";
    centered?: boolean;
    showProgress?: boolean;
    progress?: number;
};

const SIZE_MAP: Record<"sm" | "md" | "lg", number> = {
    sm: 40,
    md: 72,
    lg: 108
};

const Loading: React.FC<LoadingProps> = ({
    size = "md",
    message = "Loading...",
    variant = "default",
    centered = true,
    showProgress = false,
    progress = 0,
}) => {
    const dim = typeof size === "number" ? size : SIZE_MAP[size];

    const wrapperClass = centered
        ? "flex items-center justify-center min-h-screen"
        : "flex items-center";

    // Enhanced color presets with more sophisticated gradients
    const presets: Record<
        string,
        {
            primary: string;
            secondary: string;
            accent: string;
            glow: string;
            text: string;
            bg: string;
        }
    > = {
        default: {
            primary: "from-blue-600 via-indigo-500 to-purple-600",
            secondary: "from-purple-400 to-pink-400",
            accent: "#818cf8",
            glow: "shadow-indigo-500/30",
            text: "text-indigo-600",
            bg: "bg-gradient-to-br from-slate-50 to-gray-100",
        },
        quantum: {
            primary: "from-cyan-400 via-teal-500 to-emerald-600",
            secondary: "from-emerald-400 to-cyan-400",
            accent: "#10b981",
            glow: "shadow-emerald-500/40",
            text: "text-emerald-600",
            bg: "bg-gradient-to-br from-emerald-50 to-cyan-50",
        },
        aurora: {
            primary: "from-pink-500 via-rose-500 to-orange-500",
            secondary: "from-yellow-400 to-pink-400",
            accent: "#f97316",
            glow: "shadow-rose-500/40",
            text: "text-rose-600",
            bg: "bg-gradient-to-br from-rose-50 to-orange-50",
        },
        cosmic: {
            primary: "from-violet-600 via-purple-600 to-indigo-700",
            secondary: "from-blue-500 to-violet-500",
            accent: "#7c3aed",
            glow: "shadow-purple-600/50",
            text: "text-purple-700",
            bg: "bg-gradient-to-br from-slate-900 to-purple-900",
        },
        minimal: {
            primary: "from-gray-400 via-gray-500 to-gray-600",
            secondary: "from-gray-300 to-gray-400",
            accent: "#6b7280",
            glow: "shadow-gray-400/20",
            text: "text-gray-700",
            bg: "bg-white",
        },
    };

    const preset = presets[variant] ?? presets.default;
    const isCosmicVariant = variant === "cosmic";

    return (
        <div className={`${wrapperClass} bg-dark transition-all duration-500`}>
            <style>{`
                @keyframes spin-slow { 
                    from { transform: rotate(0deg); } 
                    to { transform: rotate(360deg); } 
                }
                @keyframes spin-reverse { 
                    from { transform: rotate(360deg); } 
                    to { transform: rotate(0deg); } 
                }
                @keyframes pulse-glow { 
                    0%, 100% { opacity: 0.4; transform: scale(1); } 
                    50% { opacity: 0.8; transform: scale(1.1); } 
                }
                @keyframes float { 
                    0%, 100% { transform: translateY(0px); } 
                    50% { transform: translateY(-10px); } 
                }
                @keyframes shimmer { 
                    0% { background-position: -200% center; } 
                    100% { background-position: 200% center; } 
                }
                @keyframes orbit-particle {
                    0% { 
                        transform: rotate(0deg) translateX(${dim * 0.6}px) rotate(0deg) scale(1);
                        opacity: 0;
                    }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { 
                        transform: rotate(360deg) translateX(${dim * 0.6}px) rotate(-360deg) scale(0.3);
                        opacity: 0;
                    }
                }
            `}</style>

            <div className="flex flex-col items-center gap-6">
                <div
                    className="relative"
                    style={{ width: dim, height: dim }}
                    role="status"
                    aria-live="polite"
                    aria-label={message}
                >
                    {/* Background glow effect */}
                    <div
                        className={`absolute inset-0 rounded-full bg-gradient-to-r ${preset.primary} ${preset.glow} blur-xl opacity-30`}
                        style={{
                            animation: "pulse-glow 2s ease-in-out infinite",
                            transform: "scale(1.2)",
                        }}
                    />

                    {/* Main spinner rings */}
                    <div className="absolute inset-0">
                        {/* Outer ring */}
                        <div
                            className={`absolute inset-0 rounded-full bg-gradient-to-tr ${preset.primary}`}
                            style={{
                                animation: "spin-slow 3s linear infinite",
                                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                                transform: "scale(1)",
                            }}
                        />

                        {/* Middle ring */}
                        <div
                            className={`absolute inset-[15%] rounded-full bg-gradient-to-br ${preset.secondary}`}
                            style={{
                                animation: "spin-reverse 2s linear infinite",
                                clipPath: "polygon(50% 0%, 85% 15%, 100% 50%, 85% 85%, 50% 100%, 15% 85%, 0% 50%, 15% 15%)",
                            }}
                        />

                        {/* Inner core */}
                        <div
                            className={`absolute inset-[30%] rounded-full ${isCosmicVariant ? 'bg-slate-800' : 'bg-white'} shadow-inner`}
                            style={{
                                background: isCosmicVariant
                                    ? `radial-gradient(circle at 30% 30%, ${preset.accent}, #1e293b)`
                                    : `radial-gradient(circle at 30% 30%, white, ${preset.accent}20)`,
                            }}
                        >
                            {/* Center dot */}
                            <div
                                className="absolute inset-[35%] rounded-full"
                                style={{
                                    background: `radial-gradient(circle, ${preset.accent}, ${preset.accent}80)`,
                                    animation: "pulse-glow 1.5s ease-in-out infinite",
                                }}
                            />
                        </div>
                    </div>

                    {/* Orbiting particles */}
                    <div className="absolute inset-0 pointer-events-none">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute left-1/2 top-1/2"
                                style={{
                                    width: dim * 0.08,
                                    height: dim * 0.08,
                                    marginLeft: -(dim * 0.04),
                                    marginTop: -(dim * 0.04),
                                    animation: `orbit-particle 3s ease-in-out infinite`,
                                    animationDelay: `${i * 0.5}s`,
                                }}
                            >
                                <div
                                    className={`w-full h-full rounded-full ${isCosmicVariant ? 'bg-white' : ''}`}
                                    style={{
                                        background: isCosmicVariant
                                            ? 'white'
                                            : `linear-gradient(135deg, ${preset.accent}, ${preset.accent}40)`,
                                        boxShadow: `0 0 ${dim * 0.15}px ${preset.accent}60`,
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Progress indicator (optional) */}
                    {showProgress && (
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: `conic-gradient(from 0deg, ${preset.accent} ${progress * 3.6}deg, transparent ${progress * 3.6}deg)`,
                                opacity: 0.3,
                            }}
                        />
                    )}
                </div>

                {/* Text section */}
                <div className="flex flex-col items-center gap-2">
                    <div
                        className={`font-semibold ${preset.text} ${isCosmicVariant ? 'text-white' : ''}`}
                        style={{
                            fontSize: dim * 0.2,
                            letterSpacing: "0.025em",
                            animation: "float 3s ease-in-out infinite",
                        }}
                    >
                        {message}
                    </div>

                    {/* Loading bar */}
                    <div
                        className={`relative h-1 rounded-full overflow-hidden ${isCosmicVariant ? 'bg-slate-700' : 'bg-gray-200'}`}
                        style={{ width: dim * 1.5 }}
                    >
                        <div
                            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${preset.primary}`}
                            style={{
                                width: showProgress ? `${progress}%` : "100%",
                                animation: showProgress ? "none" : "shimmer 2s linear infinite",
                                backgroundSize: "200% 100%",
                                transition: "width 0.3s ease-out",
                            }}
                        />
                    </div>

                    {/* Additional status text */}
                    {showProgress && (
                        <div className={`text-sm ${isCosmicVariant ? 'text-gray-300' : 'text-gray-500'} tabular-nums`}>
                            {progress}% complete
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Loading;
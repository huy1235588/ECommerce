import "@/styles/components/loading.css"
import React from "react";

interface LoadingCubeProps {
    style?: React.CSSProperties;
    color?: string;
    size?: string;
}

const LoadingCube: React.FC<LoadingCubeProps> = ({ style, color, size }) => {
    return (
        <div
            className="loading-lds-ellipsis"
            style={{
                ...style,
                "--loading-lds-ellipsis-color": color,
                "--loading-lds-ellipsis-size": size,
            } as React.CSSProperties}
        >
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

export default LoadingCube;
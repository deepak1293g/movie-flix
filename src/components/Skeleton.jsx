import React from 'react';

const Skeleton = ({ className, variant = 'rect' }) => {
    const baseStyles = "bg-white/5 animate-pulse relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent";

    const variants = {
        rect: "rounded-xl",
        circle: "rounded-full",
        text: "rounded h-4 w-full"
    };

    return (
        <div className={`${baseStyles} ${variants[variant]} ${className}`}></div>
    );
};

export const MovieCardSkeleton = ({ variant = 'portrait' }) => {
    const isLandscape = variant === 'landscape';
    return (
        <div className={`flex-shrink-0 ${isLandscape ? 'w-64 sm:w-96 aspect-video' : 'w-40 sm:w-60 aspect-[2/3]'}`}>
            <Skeleton className="w-full h-full rounded-2xl" />
            <div className="mt-4 space-y-2 px-1">
                <Skeleton variant="text" className="w-3/4" />
                <Skeleton variant="text" className="w-1/2 opacity-50" />
            </div>
        </div>
    );
};

export default Skeleton;

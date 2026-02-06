import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Check } from 'lucide-react';
import { fetchMovies } from '../services/tmdb';
import AuthContext from '../context/AuthContext';
import * as userService from '../services/userService';
import toast from 'react-hot-toast';

const Hero = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        const loadMovies = async () => {
            const trending = await fetchMovies('trending');
            setMovies(trending.slice(0, 5));
        };
        const loadWatchlist = async () => {
            if (user) {
                try {
                    const data = await userService.getWatchlist();
                    setWatchlist(data);
                } catch (err) {
                    console.error("Error loading watchlist:", err);
                }
            }
        };
        loadMovies();
        loadWatchlist();
        setTimeout(() => setIsVisible(true), 100);
    }, [user]);

    // Auto-slide every 5 seconds
    useEffect(() => {
        if (movies.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [movies.length]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? movies.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    };

    if (movies.length === 0) {
        return <div className="h-[60vh] sm:h-[75vh] lg:h-[90vh] bg-gradient-to-b from-black to-[#0f1014] flex items-center justify-center">
            <div className="text-white text-xl sm:text-2xl">Loading...</div>
        </div>;
    }

    const currentMovie = movies[currentIndex];
    const isInWatchlist = watchlist.some(item => item.id === currentMovie._id);

    const handlePlay = () => {
        const slug = currentMovie.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        navigate(`/watch/${currentMovie._id}/${slug}?type=${currentMovie.type || 'movie'}`);
    };

    const toggleWatchlist = async () => {
        if (!user) {
            toast.error("Please login to manage your watchlist.");
            return;
        }

        try {
            if (isInWatchlist) {
                await userService.removeFromWatchlist(currentMovie._id);
                setWatchlist(prev => prev.filter(item => item.id !== currentMovie._id));
                toast.success("Removed from My List");
            } else {
                await userService.addToWatchlist({
                    id: currentMovie._id,
                    type: currentMovie.type || 'movie',
                    title: currentMovie.title,
                    posterUrl: currentMovie.posterUrl || currentMovie.thumbnailUrl
                });
                setWatchlist(prev => [...prev, { id: currentMovie._id }]);
                toast.success("Added to My List");
            }
        } catch (err) {
            toast.error("Failed to update watchlist");
        }
    };

    return (
        <div className="relative h-[60vh] sm:h-[75vh] md:h-[85vh] lg:h-[90vh] overflow-hidden">
            {/* Background Image Slider */}
            {movies.map((movie, index) => (
                <div
                    key={movie._id}
                    className={`absolute inset-0 transition-all duration-1000 ${index === currentIndex
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-110'
                        }`}
                    style={{
                        backgroundImage: `url(${movie.backdropUrl || movie.thumbnailUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                    }}
                >
                    {/* Gradient Overlays - More opaque on mobile for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 sm:via-black/80 to-black/30 sm:to-black/20"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-black/50 sm:via-black/30 to-transparent"></div>
                </div>
            ))}

            {/* Content */}
            <div className={`relative h-full flex items-center px-6 sm:px-12 md:px-20 lg:px-24 max-w-[1600px] mx-auto transition-all duration-1000 pt-24 md:pt-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                <div className="max-w-3xl space-y-2 sm:space-y-4 md:space-y-5">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <span className="px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 bg-brand-red/20 border border-brand-red text-brand-red text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider rounded-full">
                            {currentMovie.category}
                        </span>
                        <span className="text-yellow-500 flex items-center gap-1 text-xs sm:text-base md:text-lg font-bold">
                            ★ {currentMovie.rating}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-black text-white leading-tight tracking-tight">
                        {currentMovie.title}
                    </h1>

                    {/* Description */}
                    <p className="text-xs sm:text-lg md:text-base lg:text-lg xl:text-xl text-gray-300 leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-2xl">
                        {currentMovie.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-gray-400 text-[10px] sm:text-xs md:text-sm flex-wrap">
                        <span className="font-bold text-white">{currentMovie.year}</span>
                        <span>•</span>
                        <span>{currentMovie.duration}</span>
                        <span>•</span>
                        <span className="uppercase">{currentMovie.type}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6">
                        <button
                            onClick={handlePlay}
                            className="flex items-center gap-2 sm:gap-3 bg-brand-red hover:bg-red-700 text-white px-4 sm:px-10 py-2.5 sm:py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-brand-red/30 group"
                        >
                            <Play className="w-4 h-4 sm:w-6 sm:h-6 fill-current group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] sm:text-base">Play Now</span>
                        </button>
                        <button
                            onClick={toggleWatchlist}
                            className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-10 py-2.5 sm:py-4 rounded-xl font-black uppercase tracking-widest transition-all border-2 ${isInWatchlist
                                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                : 'bg-transparent border-white/40 text-white hover:bg-white hover:text-black hover:border-white'
                                }`}
                        >
                            {isInWatchlist ? (
                                <Check className="w-4 h-4 sm:w-6 sm:h-6" />
                            ) : (
                                <Plus className="w-4 h-4 sm:w-6 sm:h-6" />
                            )}
                            <span className="text-[10px] sm:text-base">{isInWatchlist ? 'In My List' : 'My List'}</span>
                        </button>
                    </div>

                    {/* Slide Indicators */}
                    <div className="flex items-center gap-1.5 sm:gap-2 pt-3 sm:pt-4 md:pt-6">
                        {movies.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-0.5 sm:h-1 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'w-8 sm:w-10 md:w-12 bg-brand-red'
                                    : 'w-5 sm:w-6 md:w-8 bg-white/30 hover:bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator - Hidden on mobile */}
            <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
                <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
                    <div className="w-1 h-2 bg-white/50 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default Hero;

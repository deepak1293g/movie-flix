import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovies } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { MovieCardSkeleton } from '../components/Skeleton';
import QuickInfoModal from '../components/QuickInfoModal';

const BrowsePage = () => {
    const { type } = useParams(); // 'movies' or 'series'
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const pageRef = useRef(null);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            setIsVisible(false);

            const allContent = await fetchMovies('trending');

            let items = [];
            if (type === 'movies') {
                items = allContent.filter(item => item.type === 'movie');
            } else if (type === 'series') {
                items = allContent.filter(item => item.type === 'tv');
            }

            setContent(items);
            setLoading(false);
            setTimeout(() => setIsVisible(true), 100);
        };
        loadContent();
    }, [type]);

    const title = type === 'movies' ? 'All Movies' : 'All Series';
    const subtitle = type === 'movies'
        ? 'Browse our complete collection of movies'
        : 'Explore our complete series catalog';

    return (
        <div ref={pageRef} className="min-h-screen bg-[#0f1014] text-white pt-48 md:pt-36 px-4 sm:px-8">
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <div className={`mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h1 className="text-4xl sm:text-6xl font-display font-black mb-2 text-white uppercase tracking-tight">
                        {title}
                    </h1>
                    <p className="text-gray-500 text-lg font-medium tracking-wide">{subtitle}</p>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8 pb-20">
                        {[...Array(12)].map((_, i) => <MovieCardSkeleton key={i} />)}
                    </div>
                ) : content.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8 pb-20">
                        {content.map((item, index) => (
                            <div
                                key={item._id}
                                className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: `${index * 30}ms` }}
                            >
                                <MovieCard {...item} onInfo={() => {
                                    setSelectedMovie(item);
                                    setIsModalOpen(true);
                                }} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 flex flex-col items-center">
                        <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">No Items Found</h2>
                    </div>
                )}
            </div>

            <QuickInfoModal
                movie={selectedMovie}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default BrowsePage;

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovies } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { MovieCardSkeleton } from '../components/Skeleton';
import QuickInfoModal from '../components/QuickInfoModal';

const BrowsePage = () => {
    const { type } = useParams(); // 'movies' or 'series'
    const [content, setContent] = useState([]);
    const [filteredContent, setFilteredContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [genre, setGenre] = useState('All');
    const [year, setYear] = useState('All');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const pageRef = useRef(null);

    const genres = ['All', 'Action', 'Comedy', 'Drama', 'Fantasy', 'Sci-Fi', 'Thriller', 'Horror', 'Romance', 'Documentary'];
    const years = ['All', '2024', '2023', '2022', '2015', '2012', '2010', '2008', '2006'];

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            setIsVisible(false);
            // Reset filters when switching categories
            setGenre('All');
            setYear('All');

            const allContent = await fetchMovies('trending');

            let items = [];
            if (type === 'movies') {
                items = allContent.filter(item => item.type === 'movie');
            } else if (type === 'series') {
                items = allContent.filter(item => item.type === 'tv');
            }

            setContent(items);
            setFilteredContent(items);
            setLoading(false);
            setTimeout(() => setIsVisible(true), 100);
        };
        loadContent();
    }, [type]);

    useEffect(() => {
        let result = content;

        if (genre !== 'All') {
            result = result.filter(item =>
                (item.category && item.category.toLowerCase().includes(genre.toLowerCase())) ||
                (item.genre && item.genre.toLowerCase().includes(genre.toLowerCase())) ||
                (item.genres && item.genres.toLowerCase().includes(genre.toLowerCase()))
            );
        }

        if (year !== 'All') {
            result = result.filter(item => item.year === year);
        }

        setFilteredContent(result);
    }, [genre, year, content]);

    const title = type === 'movies' ? 'All Movies' : 'All Series';
    const subtitle = type === 'movies'
        ? 'Browse our complete collection of movies'
        : 'Explore our complete series catalog';

    return (
        <div ref={pageRef} className="min-h-screen bg-[#0f1014] text-white pt-36 px-4 sm:px-8">
            <div className="max-w-[1600px] mx-auto">
                {/* Header & Filters */}
                <div className={`mb-20 flex flex-col lg:flex-row lg:items-center justify-between gap-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div>
                        <h1 className="text-4xl sm:text-6xl font-display font-black mb-2 text-white uppercase tracking-tight">
                            {title}
                        </h1>
                        <p className="text-gray-500 text-lg font-medium tracking-wide">{subtitle}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 bg-white/[0.03] p-3 rounded-[2rem] border border-white/10 backdrop-blur-2xl shadow-2xl">
                        {/* Genre Filter */}
                        <div className="flex flex-col gap-1.5 px-6 border-r border-white/5">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Genre Spectrum</span>
                            <div className="relative group/select">
                                <select
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                    className="bg-transparent text-white font-black text-sm outline-none cursor-pointer hover:text-brand-red transition-all appearance-none pr-6"
                                >
                                    {genres.map(g => <option key={g} value={g} className="bg-[#0f1014] text-white py-2">{g}</option>)}
                                </select>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover/select:text-brand-red transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Year Filter */}
                        <div className="flex flex-col gap-1.5 px-6 border-r border-white/5">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Timeline</span>
                            <div className="relative group/select">
                                <select
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="bg-transparent text-white font-black text-sm outline-none cursor-pointer hover:text-brand-red transition-all appearance-none pr-6"
                                >
                                    {years.map(y => <option key={y} value={y} className="bg-[#0f1014] text-white py-2">{y}</option>)}
                                </select>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover/select:text-brand-red transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 flex items-center gap-6 min-w-[140px]">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Matches</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-black text-lg">{loading ? '...' : filteredContent.length}</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse"></div>
                                </div>
                            </div>
                            {(genre !== 'All' || year !== 'All') && (
                                <button
                                    onClick={() => { setGenre('All'); setYear('All'); }}
                                    className="px-4 py-2 rounded-full bg-brand-red/10 border border-brand-red/20 text-[10px] font-black text-brand-red uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all transform active:scale-95 whitespace-nowrap"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8 pb-20">
                        {[...Array(12)].map((_, i) => <MovieCardSkeleton key={i} />)}
                    </div>
                ) : filteredContent.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8 pb-20">
                        {filteredContent.map((item, index) => (
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
                    <div className="text-center py-40 bg-white/5 rounded-[48px] border border-dashed border-white/10 max-w-4xl mx-auto flex flex-col items-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 mb-8 border border-white/10">
                            <Film className="w-12 h-12 text-gray-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">No Matches Found</h2>
                        <p className="text-gray-500 max-w-sm mx-auto text-lg leading-relaxed mb-10">Adjust your filters or try another year to find hidden gems in our database.</p>
                        <button
                            onClick={() => { setGenre('All'); setYear('All'); }}
                            className="bg-brand-red hover:bg-red-700 transition-all px-12 py-4 rounded-full font-black uppercase tracking-widest shadow-2xl shadow-brand-red/30 transform active:scale-95"
                        >
                            Reset Filters
                        </button>
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

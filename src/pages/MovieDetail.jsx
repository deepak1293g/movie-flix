import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Star, Check, Plus } from 'lucide-react';
import axios from 'axios';
import ContentContext from '../context/ContentContext';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    const { toggleWatchlist, isInWatchlist } = useContext(ContentContext);

    useEffect(() => {
        const fetchMovie = async () => {
            // Mock data for now, replace with API call later if backend is ready
            // const { data } = await axios.get(`/api/movies/${id}`);
            // setMovie(data);

            // Simulating API response for demo until backend integration
            setMovie({
                _id: id,
                id: id,
                title: "Thunder Stunt",
                description: "In a world where speed determines survival, an elite tactical unit must execute the most dangerous stunt ever attempted to save their city from total destruction.",
                thumbnailUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2574&auto=format&fit=crop",
                videoUrl: "#",
                category: "Action",
                year: 2024,
                duration: "2h 14m",
                rating: 4.5
            });
        };
        fetchMovie();
    }, [id]);

    if (!movie) return <div className="text-white text-center pt-20">Loading...</div>;

    const movieStatusId = movie._id || movie.id;

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-20 pb-20">
            <div className="relative h-[70vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 transform scale-105" style={{ backgroundImage: `url(${movie.thumbnailUrl})` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent opacity-80"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-8 sm:p-20 w-full z-10 max-w-4xl">
                    <span className="text-brand-red font-black uppercase tracking-[0.4em] text-xs mb-4 block animate-pulse">New Arrival</span>
                    <h1 className="text-5xl sm:text-7xl font-display font-black mb-6 tracking-tighter uppercase leading-[0.9]">{movie.title}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8 font-bold text-sm">
                        <span className="bg-white/5 px-3 py-1 rounded-lg border border-white/10">{movie.year}</span>
                        <span className="flex items-center gap-1.5 text-yellow-500 font-black px-3 py-1 bg-yellow-500/10 rounded-lg border border-yellow-500/20"><Star className="w-4 h-4 fill-current" /> {movie.rating}</span>
                        <span className="opacity-60 whitespace-nowrap">{movie.duration}</span>
                        <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 uppercase tracking-widest text-[10px]">{movie.category}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1800px] mx-auto px-8 sm:px-20 py-12 grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2">
                    <div className="mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-widest text-white/40 mb-6">Overview</h2>
                        <p className="text-gray-300 text-xl leading-relaxed font-light">{movie.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Link to={`/watch/${movie._id}`} className="flex items-center gap-3 premium-gradient-red text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(229,9,20,0.4)] active:scale-95 shadow-2xl">
                            <Play className="fill-white w-5 h-5 ml-1" />
                            Watch Now
                        </Link>
                        <button
                            onClick={() => toggleWatchlist(movie)}
                            className={`flex items-center gap-3 px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all border ${isInWatchlist(movieStatusId) ? 'bg-white/5 border-brand-red/40 text-white hover:bg-white/10' : 'bg-white text-black hover:bg-gray-200 shadow-2xl'}`}
                        >
                            {isInWatchlist(movieStatusId) ? <Check className="w-5 h-5 text-brand-red" /> : <Plus className="w-5 h-5" />}
                            {isInWatchlist(movieStatusId) ? 'Already Added' : 'Add to List'}
                        </button>
                    </div>
                </div>

                <div className="glass-dark p-8 rounded-[32px] border border-white/5 h-fit shadow-2xl">
                    <h3 className="font-black uppercase tracking-[0.2em] text-xs text-brand-red mb-6 opacity-60">Technical Specs</h3>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                            <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Released</span>
                            <span className="text-white font-black">{movie.year}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                            <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Duration</span>
                            <span className="text-white font-black">{movie.duration}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                            <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Genre</span>
                            <span className="text-white font-black">{movie.category}</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Quality</span>
                            <span className="text-brand-red font-black">4K / ATMOS</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;

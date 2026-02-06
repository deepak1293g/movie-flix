import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Plus, ThumbsUp, ChevronDown, Check, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ContentContext from '../context/ContentContext';

const QuickInfoModal = ({ movie, isOpen, onClose }) => {
    const navigate = useNavigate();
    const { isInWatchlist, toggleWatchlist, isDownloaded, addDownload } = useContext(ContentContext);

    if (!movie) return null;

    const movieStatusId = movie._id || movie.id;

    const handlePlay = () => {
        navigate(`/watch/${movieStatusId}`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-10 overflow-y-auto">
                    {/* Backdrop Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="relative w-full max-w-5xl glass-dark rounded-[32px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-10 border border-white/5"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-50 p-2.5 bg-black/40 hover:bg-brand-red text-white rounded-full transition-all border border-white/10 group active:scale-90"
                        >
                            <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
                        </button>

                        {/* Banner Area */}
                        <div className="relative aspect-video sm:aspect-[21/9]">
                            <img
                                src={movie.image || movie.posterUrl || movie.thumbnailUrl}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent opacity-60"></div>

                            <div className="absolute bottom-10 left-10 space-y-6 max-w-2xl">
                                <span className="text-brand-red font-black uppercase tracking-[0.4em] text-[10px] block opacity-80">Featured Content</span>
                                <h2 className="text-4xl sm:text-6xl font-black text-white drop-shadow-2xl tracking-tighter uppercase leading-none">
                                    {movie.title}
                                </h2>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handlePlay}
                                        className="flex items-center gap-3 premium-gradient-red text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(229,9,20,0.3)]"
                                    >
                                        <Play className="w-5 h-5 fill-current ml-1" />
                                        PLAY
                                    </button>
                                    <button
                                        onClick={() => toggleWatchlist(movie)}
                                        className={`p-4 border rounded-full transition-all ${isInWatchlist(movieStatusId) ? 'bg-white/5 border-brand-red/40 text-white hover:bg-white/10' : 'bg-white text-black border-transparent hover:bg-gray-200'}`}
                                        title={isInWatchlist(movieStatusId) ? "Already Added" : "Add to List"}
                                    >
                                        {isInWatchlist(movieStatusId) ? <Check className="w-5 h-5 text-brand-red" /> : <Plus className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => addDownload(movie)}
                                        className={`p-4 border rounded-full transition-all ${isDownloaded(movieStatusId) ? 'bg-green-600/10 border-green-600/30 text-green-500' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                                        title={isDownloaded(movieStatusId) ? "Already Added" : "Download"}
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Metadata Details */}
                        <div className="p-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-white">
                            <div className="md:col-span-2 space-y-8">
                                <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-gray-400">
                                    <span className="text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">{movie.rating || '9.5'} Rating</span>
                                    <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{movie.year || '2024'}</span>
                                    <span className="border border-brand-red/30 text-brand-red px-2 py-0.5 rounded">ULTRA HD</span>
                                </div>
                                <p className="text-xl text-gray-300 leading-relaxed font-light">
                                    {movie.description || movie.overview || "This masterpiece brings together a compelling narrative with breathtaking visuals, taking you on an unforgettable journey through the heart of cinematic excellence."}
                                </p>
                            </div>

                            <div className="space-y-6 pt-1">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Genres</span>
                                    <span className="text-white font-black text-sm">{movie.genre || movie.category || 'Action, Drama'}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Maturity Rating</span>
                                    <span className="text-white font-black text-sm">18+ (High Intensity)</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Available in</span>
                                    <span className="text-brand-red font-black text-sm">Hindi, English, Spanish</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default QuickInfoModal;

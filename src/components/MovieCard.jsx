import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, X, ChevronDown, Info, Check, Download, Plus } from 'lucide-react';
import ContentContext from '../context/ContentContext';

const MovieCard = ({ _id, title, image, thumbnailUrl, posterUrl, variant = 'portrait', subtitle, rating, type = 'movie', resumeTime, onRemove, onInfo }) => {
    const { isInWatchlist, isDownloaded, toggleWatchlist, addDownload } = useContext(ContentContext);
    const navigate = useNavigate();
    const isLandscape = variant === 'landscape';
    const displayImage = image || thumbnailUrl || posterUrl;
    const movieStatusId = _id;

    // Create Slug for URL
    const slug = title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let linkTo = _id && slug ? `/watch/${_id}/${slug}?type=${type}` : '#';

    // Add resume timestamp if provided
    if (resumeTime && linkTo !== '#') {
        linkTo += `&t=${Math.floor(resumeTime)}`;
    }

    const handleNavigation = () => {
        if (linkTo !== '#') {
            navigate(linkTo);
        }
    };

    const handleCardClick = (e) => {
        // Prevent navigation if any interactive element was clicked
        if (e.target.closest('button') || e.target.tagName === 'BUTTON') {
            return;
        }

        if (linkTo !== '#') {
            navigate(linkTo);
        }
    };

    return (
        <div
            onClick={(e) => handleCardClick(e)}
            className={`group relative rounded-[20px] overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:z-40 ${isLandscape ? 'aspect-video w-56 sm:w-80' : 'aspect-[2/3] w-36 sm:w-56'} flex-shrink-0 block hover:red-glow-border border border-white/5`}
        >
            <img src={displayImage} alt={title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500"></div>


            {/* Premium Hover Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5 glass-dark">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-sm sm:text-xl font-black text-white leading-tight mb-2 drop-shadow-xl tracking-tighter line-clamp-2">
                        {title}
                    </h3>

                    <div className="flex items-center gap-3 mb-4">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleNavigation();
                            }}
                            className="flex items-center gap-1.5 bg-brand-red/20 hover:bg-brand-red/40 px-3 py-1 rounded-full border border-brand-red/30 transition-all active:scale-95 group/watch"
                        >
                            <Play className="w-3.5 h-3.5 fill-brand-red text-brand-red group-hover/watch:scale-110 transition-transform" />
                            <span className="text-[10px] font-black text-brand-red tracking-widest uppercase">
                                {resumeTime ? 'Resume' : 'Watch Now'}
                            </span>
                        </button>
                        {rating && (
                            <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-black">
                                ★ {rating}
                            </div>
                        )}
                        <span className="text-[10px] font-bold text-gray-400 tracking-widest hidden sm:inline">{type}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleWatchlist({ _id: movieStatusId, id: movieStatusId, title, thumbnailUrl: displayImage, type });
                                }}
                                className={`p-2.5 rounded-full transition-all border shadow-xl active:scale-90 ${isInWatchlist(movieStatusId) ? 'bg-brand-red text-white border-brand-red' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
                                title={isInWatchlist(movieStatusId) ? "Remove from List" : "Add to List"}
                            >
                                {isInWatchlist(movieStatusId) ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    addDownload({ id: movieStatusId, title, thumbnailUrl: displayImage, type });
                                }}
                                className={`p-2.5 rounded-full transition-all border shadow-xl active:scale-90 ${isDownloaded(movieStatusId) ? 'bg-green-600/20 text-green-500 border-green-600/30' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
                                title={isDownloaded(movieStatusId) ? "Already Downloaded" : "Download"}
                            >
                                {isDownloaded(movieStatusId) ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                            </button>
                            {onRemove && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onRemove();
                                    }}
                                    className="p-2.5 bg-white/5 hover:bg-brand-red text-white rounded-full transition-all border border-white/10 group/rem"
                                    title="Remove from history"
                                >
                                    <X className="w-4 h-4 transition-transform group-hover/rem:rotate-90" />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onInfo();
                            }}
                            className="p-2.5 bg-white text-black hover:bg-brand-red hover:text-white rounded-full transition-all shadow-2xl transform active:scale-90"
                            title="More Info"
                        >
                            <Info className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Static Bottom Title (Fade out on hover) */}
            <div className="absolute bottom-0 left-0 p-5 w-full bg-gradient-to-t from-black/95 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                <h3 className={`font-display font-black text-white leading-none truncate ${isLandscape ? 'text-2xl' : 'text-lg sm:text-xl'}`}>{title}</h3>
                {subtitle && <p className="text-brand-red text-[10px] font-black tracking-[0.2em] mb-1 opacity-80">{subtitle}</p>}
            </div>
        </div>
    );
};

export default MovieCard;

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Play, Trash2, Plus, Film, Tv, Star } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import * as userService from '../services/userService';
import toast from 'react-hot-toast';

const MyListPage = () => {
    const { user } = useContext(AuthContext);
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchWatchlist = async () => {
            if (!user) return;
            try {
                const data = await userService.getWatchlist();
                setWatchlist(data);
            } catch (err) {
                console.error("Error fetching watchlist:", err);
            } finally {
                setLoading(false);
                setTimeout(() => setIsVisible(true), 100);
            }
        };
        fetchWatchlist();
    }, [user]);

    const handleRemove = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await userService.removeFromWatchlist(id);
            setWatchlist(watchlist.filter(item => item.id !== id));
            toast.success("Removed from My List");
        } catch (err) {
            toast.error("Failed to remove item");
        }
    };

    if (!user) return (
        <div className="pt-32 text-center h-screen bg-[#050505] flex flex-col items-center justify-center px-4">
            <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
                <Plus className="w-12 h-12 text-gray-600" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tighter mb-6">Discovery Awaits</h1>
            <p className="text-gray-500 max-w-sm mx-auto mb-10 font-bold uppercase tracking-widest text-xs opacity-60">Authentication required to view personalized collection.</p>
            <Link to="/login" className="premium-gradient-red hover:scale-105 active:scale-95 px-14 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all shadow-[0_20px_60px_rgba(229,9,20,0.3)]">Login Access</Link>
        </div>
    );

    return (
        <div className="pt-32 min-h-screen bg-[#0f1014] pb-20 px-4 sm:px-12">
            <div className={`max-w-6xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <header className="mb-16">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">My List</h1>
                    <p className="text-gray-400 text-sm">Your personal collection</p>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : watchlist.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 max-w-2xl mx-auto px-6">
                        <Plus className="w-16 h-16 text-gray-600 mb-6 mx-auto" />
                        <h2 className="text-2xl font-bold mb-2">Your list is empty</h2>
                        <p className="text-gray-400 mb-8 max-w-xs mx-auto">Start building your collection by adding movies and series you love.</p>
                        <Link to="/" className="bg-red-600 hover:bg-red-700 text-white px-10 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-600/20">
                            Explore Now
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {watchlist.map((item) => (
                            <Link
                                key={item.id}
                                to={`/watch/${item.id}?type=${item.type}`}
                                className="bg-white/5 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-6 border border-white/10 hover:bg-white/[0.07] transition-all group"
                            >
                                {/* Item Image */}
                                <div className="w-full sm:w-48 aspect-video flex-shrink-0 rounded-xl overflow-hidden relative bg-gray-900">
                                    <img
                                        src={item.posterUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play className="fill-white w-8 h-8 text-white" />
                                    </div>
                                </div>

                                {/* Item Info */}
                                <div className="flex-1 flex flex-col justify-center gap-1 min-w-0 w-full text-left">
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                        <span className="bg-white/10 px-2 py-0.5 rounded">{item.type}</span>
                                        <span className="text-yellow-500 flex items-center gap-1">
                                            <Star size={10} fill="currentColor" /> TOP RATED
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold truncate">{item.title}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-1 mt-1">
                                        Saved for on-demand playback in your collection.
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/10">
                                    <div className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-200 transition-all">
                                        Watch <Play size={14} fill="currentColor" />
                                    </div>
                                    <button
                                        onClick={(e) => handleRemove(e, item.id)}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-red-600/20 text-white hover:text-red-500 px-6 py-2.5 rounded-xl font-bold text-xs transition-all"
                                    >
                                        <Trash2 size={14} /> Remove
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {watchlist.length > 0 && (
                <div className="mt-12 text-center text-gray-700 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
                    Your collection ends here
                </div>
            )}
        </div>
    );
};

export default MyListPage;

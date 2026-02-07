import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';
import * as userService from '../services/userService';
import toast from 'react-hot-toast';

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        // Load Watchlist if User Logged In
        const fetchWatchlist = async () => {
            if (user) {
                try {
                    const data = await userService.getWatchlist();
                    setWatchlist(data);
                } catch (err) {
                    console.error("Error fetching watchlist:", err);
                }
            } else {
                setWatchlist([]);
            }
            setLoading(false);
        };

        fetchWatchlist();
    }, [user]);

    // Helper Functions
    const isInWatchlist = (id) => watchlist.some(item => item.id.toString() === id.toString() || (item._id && item._id.toString() === id.toString()));

    const toggleWatchlist = async (movie) => {
        if (!user) {
            toast.error("Please login to manage your watchlist.");
            return;
        }

        const id = movie._id || movie.id;
        const exists = isInWatchlist(id);

        try {
            if (exists) {
                await userService.removeFromWatchlist(id);
                setWatchlist(prev => prev.filter(item => (item.id || item._id).toString() !== id.toString()));
                toast.success("Removed from My List");
            } else {
                const movieData = {
                    id: id,
                    type: movie.type || 'movie',
                    title: movie.title,
                    posterUrl: movie.posterUrl || movie.thumbnailUrl || movie.image
                };
                await userService.addToWatchlist(movieData);
                setWatchlist(prev => [...prev, movieData]);
                toast.success("Added to My List");
            }
        } catch (err) {
            toast.error("Failed to update watchlist");
        }
    };

    return (
        <ContentContext.Provider value={{
            watchlist,
            loading,
            isInWatchlist,
            toggleWatchlist
        }}>
            {children}
        </ContentContext.Provider>
    );
};

export default ContentContext;

import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';
import * as userService from '../services/userService';
import toast from 'react-hot-toast';

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [watchlist, setWatchlist] = useState([]);
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        // Load Downloads from LocalStorage
        const storedDownloads = JSON.parse(localStorage.getItem('downloads') || '[]');
        setDownloads(storedDownloads);

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

    const isDownloaded = (id) => downloads.some(item => (item.id.toString() === id.toString() || (item._id && item._id.toString() === id.toString())) && item.progress === 100);

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

    const addDownload = (movie) => {
        if (!user) {
            toast.error("Please login to download content.");
            return;
        }

        const id = (movie.id || movie._id).toString();
        const alreadyInList = downloads.some(d => (d.id || d._id).toString() === id);

        if (alreadyInList) {
            toast("Already in Downloads", { icon: '📂' });
            return;
        }

        const downloadItem = {
            id: id,
            title: movie.title,
            type: movie.type || 'movie',
            slug: movie.title.toLowerCase().replace(/ /g, '-'),
            image: movie.thumbnailUrl || movie.backdropUrl || movie.image,
            size: "1.5 GB",
            progress: 0,
            date: 'Just now'
        };

        const updated = [...downloads, downloadItem];
        setDownloads(updated);
        localStorage.setItem('downloads', JSON.stringify(updated));
        toast.success("Added to Downloads!");
    };

    const removeDownload = (id) => {
        const updated = downloads.filter(d => (d.id || d._id).toString() !== id.toString());
        setDownloads(updated);
        localStorage.setItem('downloads', JSON.stringify(updated));
    };

    return (
        <ContentContext.Provider value={{
            watchlist,
            downloads,
            loading,
            isInWatchlist,
            isDownloaded,
            toggleWatchlist,
            addDownload,
            removeDownload
        }}>
            {children}
        </ContentContext.Provider>
    );
};

export default ContentContext;

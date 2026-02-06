// LocalStorage-based User Service
export const addToWatchlist = async (movieData) => {
    try {
        const watchlist = JSON.parse(localStorage.getItem('local_watchlist')) || [];
        if (!watchlist.find(m => m.id === movieData.id)) {
            watchlist.push(movieData);
            localStorage.setItem('local_watchlist', JSON.stringify(watchlist));
        }
        return { success: true };
    } catch (error) {
        throw error;
    }
};

export const removeFromWatchlist = async (id) => {
    try {
        let watchlist = JSON.parse(localStorage.getItem('local_watchlist')) || [];
        watchlist = watchlist.filter(m => m.id !== id);
        localStorage.setItem('local_watchlist', JSON.stringify(watchlist));
        return { success: true };
    } catch (error) {
        throw error;
    }
};

export const getWatchlist = async () => {
    try {
        return JSON.parse(localStorage.getItem('local_watchlist')) || [];
    } catch (error) {
        throw error;
    }
};

export const updateWatchHistory = async (historyData) => {
    try {
        let history = JSON.parse(localStorage.getItem('local_history')) || [];
        const index = history.findIndex(h => h.movieId === historyData.movieId);

        if (index !== -1) {
            history[index] = { ...history[index], ...historyData, updatedAt: new Date() };
        } else {
            history.push({ ...historyData, updatedAt: new Date() });
        }

        localStorage.setItem('local_history', JSON.stringify(history));
        return { success: true };
    } catch (error) {
        throw error;
    }
};

export const getWatchHistory = async () => {
    try {
        return JSON.parse(localStorage.getItem('local_history')) || [];
    } catch (error) {
        throw error;
    }
};

export const removeFromWatchHistory = async (id) => {
    try {
        let history = JSON.parse(localStorage.getItem('local_history')) || [];
        history = history.filter(h => h._id !== id && h.movieId !== id);
        localStorage.setItem('local_history', JSON.stringify(history));
        return { success: true };
    } catch (error) {
        throw error;
    }
};

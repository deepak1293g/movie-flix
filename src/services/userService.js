import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users`;

const getAuthConfig = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return {
        headers: {
            Authorization: `Bearer ${userInfo?.token}`,
        },
    };
};

export const addToWatchlist = async (movieData) => {
    const { data } = await axios.post(`${API_URL}/watchlist`, movieData, getAuthConfig());
    return data;
};

export const removeFromWatchlist = async (id) => {
    const { data } = await axios.delete(`${API_URL}/watchlist/${id}`, getAuthConfig());
    return data;
};

export const getWatchlist = async () => {
    const { data } = await axios.get(`${API_URL}/watchlist`, getAuthConfig());
    return data;
};

export const updateWatchHistory = async (historyData) => {
    const { data } = await axios.post(`${API_URL}/history`, historyData, getAuthConfig());
    return data;
};

export const getWatchHistory = async () => {
    const { data } = await axios.get(`${API_URL}/history`, getAuthConfig());
    return data;
};
export const removeFromWatchHistory = async (id) => {
    const { data } = await axios.delete(`${API_URL}/history/${id}`, getAuthConfig());
    return data;
};

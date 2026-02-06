import axios from 'axios';

const API_URL = 'http://localhost:5001/api/comments';

const getAuthConfig = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return {
        headers: {
            Authorization: `Bearer ${userInfo?.token}`,
        },
    };
};

export const addComment = async (commentData) => {
    const { data } = await axios.post(API_URL, commentData, getAuthConfig());
    return data;
};

export const getComments = async (contentId) => {
    const { data } = await axios.get(`${API_URL}/${contentId}`);
    return data;
};

export const deleteComment = async (id) => {
    const { data } = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    return data;
};

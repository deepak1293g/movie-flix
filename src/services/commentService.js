// LocalStorage-based Comment Service
export const addComment = async (commentData) => {
    try {
        const comments = JSON.parse(localStorage.getItem('local_comments')) || [];
        const newComment = {
            ...commentData,
            _id: Date.now().toString(),
            createdAt: new Date()
        };
        comments.push(newComment);
        localStorage.setItem('local_comments', JSON.stringify(comments));
        return newComment;
    } catch (error) {
        throw error;
    }
};

export const getComments = async (contentId) => {
    try {
        const comments = JSON.parse(localStorage.getItem('local_comments')) || [];
        return comments.filter(c => c.contentId === contentId);
    } catch (error) {
        throw error;
    }
};

export const deleteComment = async (id) => {
    try {
        let comments = JSON.parse(localStorage.getItem('local_comments')) || [];
        comments = comments.filter(c => c._id !== id);
        localStorage.setItem('local_comments', JSON.stringify(comments));
        return { success: true };
    } catch (error) {
        throw error;
    }
};

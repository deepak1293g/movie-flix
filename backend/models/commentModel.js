import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    userName: {
        type: String,
        required: true
    },
    contentId: {
        type: String,
        required: true // TMDB ID or local ID
    },
    contentType: {
        type: String,
        required: true,
        enum: ['movie', 'tv']
    },
    text: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 5
    }
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;

import asyncHandler from 'express-async-handler';
import Comment from '../models/commentModel.js';

// @desc    Add a comment
// @route   POST /api/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
    const { contentId, contentType, text, rating } = req.body;

    const comment = await Comment.create({
        userId: req.user._id,
        userName: req.user.name,
        contentId,
        contentType,
        text,
        rating
    });

    if (comment) {
        res.status(201).json(comment);
    } else {
        res.status(400);
        throw new Error('Invalid comment data');
    }
});

// @desc    Get comments for a content item
// @route   GET /api/comments/:contentId
// @access  Public
const getComments = asyncHandler(async (req, res) => {
    const comments = await Comment.find({ contentId: req.params.contentId }).sort({ createdAt: -1 });
    res.json(comments);
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (Owner or Admin)
const deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);

    if (comment) {
        if (comment.userId.toString() === req.user._id.toString() || req.user.isAdmin) {
            await comment.deleteOne();
            res.json({ message: 'Comment removed' });
        } else {
            res.status(401);
            throw new Error('Not authorized to delete this comment');
        }
    } else {
        res.status(404);
        throw new Error('Comment not found');
    }
});

export { addComment, getComments, deleteComment };

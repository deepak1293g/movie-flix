import express from 'express';
import { addComment, getComments, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addComment);
router.route('/:contentId').get(getComments);
router.route('/:id').delete(protect, deleteComment);

export default router;

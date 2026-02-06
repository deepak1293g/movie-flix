import express from 'express';
import {
    addToWatchlist,
    removeFromWatchlist,
    getWatchlist,
    updateWatchHistory,
    getWatchHistory,
    removeFromWatchHistory
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/watchlist').post(protect, addToWatchlist).get(protect, getWatchlist);
router.route('/watchlist/:id').delete(protect, removeFromWatchlist);
router.route('/history').post(protect, updateWatchHistory).get(protect, getWatchHistory);
router.route('/history/:id').delete(protect, removeFromWatchHistory);

export default router;

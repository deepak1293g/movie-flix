import asyncHandler from 'express-async-handler'; // Using asyncHandler wrapper
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js'; // Ensure this matches existing path

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        if (await user.matchPassword(password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Password not match');
        }
    } else {
        res.status(401);
        throw new Error('Invalid email');
    }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Add to watchlist
// @route   POST /api/users/watchlist
// @access  Private
const addToWatchlist = asyncHandler(async (req, res) => {
    const { id, type, title, posterUrl } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        if (user.watchlist.find(item => item.id === id)) {
            res.status(400);
            throw new Error('Item already in watchlist');
        }

        user.watchlist.unshift({ id, type, title, posterUrl });
        await user.save();
        res.status(201).json(user.watchlist);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Remove from watchlist
// @route   DELETE /api/users/watchlist/:id
// @access  Private
const removeFromWatchlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.watchlist = user.watchlist.filter(item => item.id !== req.params.id);
        await user.save();
        res.json(user.watchlist);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user watchlist
// @route   GET /api/users/watchlist
// @access  Private
const getWatchlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json(user.watchlist);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update watch history
// @route   POST /api/users/history
// @access  Private
const updateWatchHistory = asyncHandler(async (req, res) => {
    const { id, type, title, posterUrl, lastTime, duration } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        const historyIndex = user.watchHistory.findIndex(item => item.id === id);

        if (historyIndex > -1) {
            // Update existing history item
            user.watchHistory[historyIndex].lastTime = lastTime;
            user.watchHistory[historyIndex].duration = duration;
            user.watchHistory[historyIndex].updatedAt = Date.now();

            // Move to top
            const item = user.watchHistory.splice(historyIndex, 1)[0];
            user.watchHistory.unshift(item);
        } else {
            // Add new history item
            user.watchHistory.unshift({ id, type, title, posterUrl, lastTime, duration });
        }

        // Limit history to 20 items
        if (user.watchHistory.length > 20) {
            user.watchHistory.pop();
        }

        await user.save();
        res.json(user.watchHistory);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get watch history
// @route   GET /api/users/history
// @access  Private
const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json(user.watchHistory);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Remove from watch history
// @route   DELETE /api/users/history/:id
// @access  Private
const removeFromWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.watchHistory = user.watchHistory.filter(item => item.id !== req.params.id);
        await user.save();
        res.json(user.watchHistory);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export {
    authUser,
    registerUser,
    updateUserProfile,
    addToWatchlist,
    removeFromWatchlist,
    getWatchlist,
    updateWatchHistory,
    getWatchHistory,
    removeFromWatchHistory
};

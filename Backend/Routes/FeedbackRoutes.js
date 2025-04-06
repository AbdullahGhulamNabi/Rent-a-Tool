const express = require("express");
const router = express.Router();
const { User, Tool, FeedBack } = require("../DB/db_models");
const userMiddleware = require("../Middlewares/Authentication");

// Create new feedback
router.post('/', userMiddleware, async (req, res) => {
    try {
        // Get the authenticated user
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { toolId, rating, desc } = req.body;

        // Validate input
        if (!toolId || !rating) {
            return res.status(400).json({
                message: 'Tool ID and rating are required'
            });
        }

        // Validate rating
        if (isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: 'Rating must be a number between 1 and 5'
            });
        }

        // Check if the tool exists
        const tool = await Tool.findById(toolId);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        // Check if user has already provided feedback for this tool
        const existingFeedback = await FeedBack.findOne({
            userId: user._id,
            toolId
        });

        if (existingFeedback) {
            // Update existing feedback
            existingFeedback.rating = rating;
            if (desc) existingFeedback.desc = desc;
            await existingFeedback.save();
            
            return res.status(200).json({
                message: 'Feedback updated successfully',
                feedback: existingFeedback
            });
        }

        // Create new feedback
        const feedback = new FeedBack({
            userId: user._id,
            toolId,
            rating,
            desc: desc || ''
        });

        await feedback.save();

        return res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({
            message: 'Failed to submit feedback',
            error: error.message
        });
    }
});

// Get all feedback for a tool
router.get('/tool/:toolId', async (req, res) => {
    try {
        const { toolId } = req.params;
        
        // Check if the tool exists
        const tool = await Tool.findById(toolId);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        // Get all feedback for this tool
        const feedback = await FeedBack.find({ toolId })
            .populate('userId', 'firstName lastName profilePhoto');

        // Calculate average rating
        let averageRating = 0;
        if (feedback.length > 0) {
            const sum = feedback.reduce((total, item) => total + item.rating, 0);
            averageRating = sum / feedback.length;
        }

        return res.status(200).json({
            count: feedback.length,
            averageRating,
            feedback
        });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({
            message: 'Failed to fetch feedback',
            error: error.message
        });
    }
});

// Get all feedback by a user
router.get('/user', userMiddleware, async (req, res) => {
    try {
        // Get the authenticated user
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get all feedback by this user
        const feedback = await FeedBack.find({ userId: user._id })
            .populate('toolId', 'name image');

        return res.status(200).json(feedback);
    } catch (error) {
        console.error('Error fetching user feedback:', error);
        res.status(500).json({
            message: 'Failed to fetch user feedback',
            error: error.message
        });
    }
});

// Delete feedback
router.delete('/:feedbackId', userMiddleware, async (req, res) => {
    try {
        // Get the authenticated user
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { feedbackId } = req.params;

        // Find the feedback
        const feedback = await FeedBack.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Check if the user is the owner of the feedback
        if (feedback.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this feedback' });
        }

        // Delete the feedback
        await FeedBack.findByIdAndDelete(feedbackId);

        return res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({
            message: 'Failed to delete feedback',
            error: error.message
        });
    }
});

module.exports = router; 
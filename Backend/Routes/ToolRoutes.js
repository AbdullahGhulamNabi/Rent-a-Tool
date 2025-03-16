const express = require('express');
const router = express.Router();
const { Tool, User } = require('../DB/db_models');
const multer = require('multer');
const path = require('path');
const userMiddleware = require('../Middlewares/Authentication');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/tools')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Get all tools
router.get('/', async (req, res) => {
    try {
        const tools = await Tool.find()
            .populate('owner', 'firstName lastName email')
            .populate('rentedTo.user', 'firstName lastName email');
        res.status(200).json(tools);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single tool by ID
router.get('/:id', async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id)
            .populate('owner', 'firstName lastName email')
            .populate('rentedTo.user', 'firstName lastName email');
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        res.status(200).json(tool);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new tool
router.post('/', userMiddleware, upload.single('image'), async (req, res) => {
    try {
        // Find the user first
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const toolData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: req.file ? req.file.filename : null,
            owner: user._id
        };

        const tool = new Tool(toolData);
        const savedTool = await tool.save();

        // Add tool to user's toolsUploaded array
        await User.findByIdAndUpdate(
            user._id,
            { $push: { toolsUploaded: savedTool._id } }
        );

        // Populate owner details before sending response
        const populatedTool = await Tool.findById(savedTool._id)
            .populate('owner', 'firstName lastName email');

        res.status(201).json(populatedTool);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a tool
router.put('/:id', userMiddleware, upload.single('image'), async (req, res) => {
    try {
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user owns the tool
        const existingTool = await Tool.findById(req.params.id);
        if (!existingTool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        
        if (existingTool.owner.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this tool' });
        }

        const toolData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        };

        if (req.file) {
            toolData.image = req.file.filename;
        }

        const updatedTool = await Tool.findByIdAndUpdate(
            req.params.id,
            toolData,
            { new: true }
        ).populate('owner', 'firstName lastName email')
         .populate('rentedTo.user', 'firstName lastName email');

        res.status(200).json(updatedTool);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Rent a tool
router.post('/:id/rent', userMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tool = await Tool.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        if (tool.rented) {
            return res.status(400).json({ message: 'Tool is already rented' });
        }

        if (tool.owner.toString() === user._id.toString()) {
            return res.status(400).json({ message: 'Cannot rent your own tool' });
        }

        tool.rented = true;
        tool.rentedTo = {
            user: user._id,
            rentedAt: new Date()
        };

        await tool.save();

        // Add tool to user's toolsRented array
        await User.findByIdAndUpdate(
            user._id,
            { $push: { toolsRented: tool._id } }
        );

        const updatedTool = await Tool.findById(tool._id)
            .populate('owner', 'firstName lastName email')
            .populate('rentedTo.user', 'firstName lastName email');

        res.status(200).json(updatedTool);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Return a rented tool
router.post('/:id/return', userMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tool = await Tool.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        if (!tool.rented) {
            return res.status(400).json({ message: 'Tool is not rented' });
        }

        if (tool.rentedTo.user.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to return this tool' });
        }

        tool.rented = false;
        tool.rentedTo = null;
        await tool.save();

        // Remove tool from user's toolsRented array
        await User.findByIdAndUpdate(
            user._id,
            { $pull: { toolsRented: tool._id } }
        );

        const updatedTool = await Tool.findById(tool._id)
            .populate('owner', 'firstName lastName email');

        res.status(200).json(updatedTool);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a tool
router.delete('/:id', userMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tool = await Tool.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        // Check if user owns the tool
        if (tool.owner.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this tool' });
        }

        // Check if tool is currently rented
        if (tool.rented) {
            return res.status(400).json({ message: 'Cannot delete a tool that is currently rented' });
        }

        // Remove tool from user's toolsUploaded array
        await User.findByIdAndUpdate(
            user._id,
            { $pull: { toolsUploaded: tool._id } }
        );

        await Tool.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Tool deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const { Tool, User } = require('../DB/db_models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const userMiddleware = require('../Middlewares/Authentication');
const { sendToolRequestEmail } = require('../config/emailConfig');

// Ensure uploads directory exists
const uploadDir = 'public/uploads/tools';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload with file validation
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename with timestamp and original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size is too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ message: err.message });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

// Get all tools (public)
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

// Get logged-in user's tools
router.get('/my-tools', userMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tools = await Tool.find({ owner: user._id })
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
router.post('/', userMiddleware, upload.single('image'), handleMulterError, async (req, res) => {
    try {
        // Get user from email (from auth middleware)
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const toolData = {
            name: req.body.name,
            description: req.body.description,
            price: parseFloat(req.body.price) || 0,
            image: req.file ? req.file.filename : null,
            owner: user._id // Set owner as authenticated user's ID
        };

        const tool = new Tool(toolData);
        const savedTool = await tool.save();

        // Add tool to user's toolsUploaded array
        await User.findByIdAndUpdate(
            user._id,
            { $push: { toolsUploaded: savedTool._id } }
        );

        const populatedTool = await Tool.findById(savedTool._id)
            .populate('owner', 'firstName lastName email');

        res.status(201).json(populatedTool);
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        res.status(400).json({ message: error.message });
    }
});

// Update a tool
router.put('/:id', upload.single('image'), handleMulterError, async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        const toolData = {
            name: req.body.name,
            description: req.body.description,
            price: parseFloat(req.body.price) || 0
        };

        if (req.file) {
            if (tool.image) {
                const oldImagePath = path.join(uploadDir, tool.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
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
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        res.status(400).json({ message: error.message });
    }
});

// Rent a tool
router.post('/:id/rent', async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        if (tool.rented) {
            return res.status(400).json({ message: 'Tool is already rented' });
        }

        tool.rented = true;
        tool.rentedTo = {
            user: req.body.userId,
            rentedAt: new Date()
        };

        await tool.save();

        const updatedTool = await Tool.findById(tool._id)
            .populate('owner', 'firstName lastName email')
            .populate('rentedTo.user', 'firstName lastName email');

        res.status(200).json(updatedTool);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Return a tool
router.post('/:id/return', async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        if (!tool.rented) {
            return res.status(400).json({ message: 'Tool is not rented' });
        }

        tool.rented = false;
        tool.rentedTo = null;
        await tool.save();

        const updatedTool = await Tool.findById(tool._id)
            .populate('owner', 'firstName lastName email');

        res.status(200).json(updatedTool);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a tool
router.delete('/:id', async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        // Remove tool from owner's toolsUploaded array
        await User.findByIdAndUpdate(
            tool.owner,
            { $pull: { toolsUploaded: tool._id } }
        );

        if (tool.image) {
            const imagePath = path.join(uploadDir, tool.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Tool.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Tool deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Request a tool
router.post('/:id/request', userMiddleware, async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id)
            .populate('owner', 'firstName lastName email emailNotifications');
        
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user has already requested this tool
        const existingRequest = user.toolsRequested.find(
            request => request.tool.toString() === tool._id.toString()
        );

        if (existingRequest) {
            return res.status(400).json({ message: 'You have already requested this tool' });
        }

        // Add tool to user's requested tools
        user.toolsRequested.push({
            tool: tool._id,
            status: 'pending'
        });
        await user.save();

        // Send email notification to tool owner if they have enabled it
        if (tool.owner.emailNotifications) {
            await sendToolRequestEmail(
                tool.owner.email,
                tool.name,
                `${user.firstName} ${user.lastName}`,
                new Date().toLocaleDateString()
            );
        }

        res.status(200).json({ message: 'Tool request submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 
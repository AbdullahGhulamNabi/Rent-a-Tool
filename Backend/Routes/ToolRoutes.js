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
            .populate('owner', 'firstName lastName email address postalCode profilePhoto')
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
            .populate('owner', 'firstName lastName email address postalCode profilePhoto')
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
router.post('/:id/return', userMiddleware, async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id)
            .populate('rentedTo.user', '_id');
        
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        if (!tool.rented) {
            return res.status(400).json({ message: 'Tool is not rented' });
        }

        // Find the user who rented the tool
        const renter = await User.findById(tool.rentedTo.user._id);
        if (!renter) {
            return res.status(404).json({ message: 'Renter not found' });
        }

        // Find and remove the request from renter's toolsRequested array
        const requestIndex = renter.toolsRequested.findIndex(
            request => request.tool.toString() === tool._id.toString()
        );

        if (requestIndex !== -1) {
            try {
                // Remove the request entirely instead of just marking as completed
                console.log(`Removing tool request from user's toolsRequested array at index ${requestIndex}`);
                renter.toolsRequested.splice(requestIndex, 1);
                await renter.save();
                console.log('Tool request removed from renter');
            } catch (error) {
                console.error('Error removing tool request:', error);
                // Continue with the tool return even if removing the request fails
            }
        } else {
            console.log('No matching tool request found to remove');
        }

        // Update tool status
        tool.rented = false;
        tool.rentedTo = null;
        await tool.save();

        const updatedTool = await Tool.findById(tool._id)
            .populate('owner', 'firstName lastName email');

        res.status(200).json({
            success: true,
            message: 'Tool marked as returned successfully and request removed',
            tool: updatedTool
        });
    } catch (error) {
        console.error('Error in return tool:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Failed to mark tool as returned'
        });
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
        console.log('Tool request received for ID:', req.params.id);
        
        const tool = await Tool.findById(req.params.id)
            .populate('owner', 'firstName lastName email emailNotifications');
        
        if (!tool) {
            console.log('Tool not found');
            return res.status(404).json({ message: 'Tool not found' });
        }

        const user = await User.findOne({ email: req.email });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Tool owner email notifications:', tool.owner.emailNotifications);
        console.log('Tool owner email:', tool.owner.email);

        // Check if user has already requested this tool (any status)
        const existingRequestIndex = user.toolsRequested.findIndex(
            request => request.tool.toString() === tool._id.toString()
        );

        if (existingRequestIndex !== -1) {
            const existingRequest = user.toolsRequested[existingRequestIndex];
            
            // If pending or accepted, don't allow a new request
            if (existingRequest.status === 'pending' || existingRequest.status === 'accepted') {
                console.log('User has already requested this tool with status:', existingRequest.status);
                return res.status(400).json({ 
                    success: false,
                    message: existingRequest.status === 'pending' 
                        ? 'You have already requested this tool and it is pending approval' 
                        : 'You already have an accepted request for this tool'
                });
            }
            
            // If rejected or completed, update the existing request instead of creating a new one
            console.log('Updating existing request from status:', existingRequest.status, 'to pending');
            user.toolsRequested[existingRequestIndex].status = 'pending';
            await user.save();
            console.log('Tool request updated to pending');
        } else {
            // Add tool to user's requested tools as a new request
            user.toolsRequested.push({
                tool: tool._id,
                status: 'pending'
            });
            await user.save();
            console.log('New tool request saved to user');
        }

        // Send email notification to tool owner if they have enabled it
        if (tool.owner.emailNotifications) {
            console.log('Attempting to send email notification...');
            const emailSent = await sendToolRequestEmail(
                tool.owner.email,
                tool.name,
                `${user.firstName} ${user.lastName}`,
                new Date().toLocaleDateString()
            );
            
            if (emailSent) {
                console.log('Email sent successfully');
            } else {
                console.log('Failed to send email');
            }
        } else {
            console.log('Email notifications are disabled for this user');
        }

        res.status(200).json({ success: true, message: 'Tool request submitted successfully' });
    } catch (error) {
        console.error('Error in tool request:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router; 
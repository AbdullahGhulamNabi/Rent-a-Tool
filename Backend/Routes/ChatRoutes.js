const express = require('express');
const router = express.Router();
const { User, Chat } = require('../DB/db_models');
const userMiddleware = require('../Middlewares/Authentication');

// Get all chats for the current user
router.get('/', userMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find chats where user is participant and hasn't deleted the chat
        const chats = await Chat.find({ 
            participants: user._id,
            deletedBy: { $ne: user._id } // Not deleted by this user
        })
            .populate('participants', 'firstName lastName profilePhoto')
            .sort({ 'messages.time': -1 });

        // Process chats to include last message and unread count
        const processedChats = chats.map(chat => {
            const otherParticipants = chat.participants.filter(
                p => p._id.toString() !== user._id.toString()
            );
            const lastMessage = chat.messages.length > 0 ? 
                chat.messages[chat.messages.length - 1] : null;
            
            const unreadCount = chat.messages.filter(
                m => !m.read && m.sender.toString() !== user._id.toString()
            ).length;

            return {
                _id: chat._id,
                participants: otherParticipants,
                lastMessage: lastMessage ? {
                    text: lastMessage.text,
                    time: lastMessage.time,
                    sender: lastMessage.sender,
                    isFromUser: lastMessage.sender.toString() === user._id.toString()
                } : null,
                unreadCount
            };
        });

        res.json(processedChats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get a specific chat by ID
router.get('/:chatId', userMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const chat = await Chat.findOne({
            _id: req.params.chatId,
            participants: user._id
        }).populate('participants', 'firstName lastName profilePhoto')
          .populate('messages.sender', 'firstName lastName profilePhoto');

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        res.json(chat);
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create a new chat
router.post('/', userMiddleware, async (req, res) => {
    try {
        const { participantId } = req.body;
        
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if participant exists
        const participant = await User.findById(participantId);
        if (!participant) {
            return res.status(404).json({ message: 'Participant not found' });
        }

        // Check if chat already exists between these users (that hasn't been deleted by this user)
        const existingChat = await Chat.findOne({
            participants: { $all: [user._id, participant._id] },
            deletedBy: { $ne: user._id } // Make sure chat is not marked as deleted by current user
        });

        if (existingChat) {
            return res.json(existingChat);
        }

        // If there's a chat deleted by the current user, update it by removing user from deletedBy
        const deletedChat = await Chat.findOne({
            participants: { $all: [user._id, participant._id] },
            deletedBy: user._id
        });

        if (deletedChat) {
            // Restore the chat by removing user from deletedBy
            deletedChat.deletedBy = deletedChat.deletedBy.filter(
                id => id.toString() !== user._id.toString()
            );
            await deletedChat.save();
            
            // Return the restored chat
            const populatedDeletedChat = await Chat.findById(deletedChat._id)
                .populate('participants', 'firstName lastName profilePhoto');
                
            return res.json(populatedDeletedChat);
        }

        // Create new chat if no existing chat is found
        const newChat = new Chat({
            participants: [user._id, participant._id],
            messages: []
        });

        await newChat.save();

        // Populate the participants
        const populatedChat = await Chat.findById(newChat._id)
            .populate('participants', 'firstName lastName profilePhoto');

        res.status(201).json(populatedChat);
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ message: error.message });
    }
});

// Send a message
router.post('/:chatId/messages', userMiddleware, async (req, res) => {
    try {
        const { text } = req.body;
        
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const chat = await Chat.findOne({
            _id: req.params.chatId,
            participants: user._id
        });

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Add message
        const newMessage = {
            sender: user._id,
            text,
            time: new Date(),
            read: false
        };

        chat.messages.push(newMessage);
        await chat.save();

        // Return the new message with sender info
        const updatedChat = await Chat.findById(chat._id)
            .populate('messages.sender', 'firstName lastName profilePhoto');
        
        const sentMessage = updatedChat.messages[updatedChat.messages.length - 1];

        res.status(201).json(sentMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: error.message });
    }
});

// Mark messages as read
router.put('/:chatId/read', userMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const chat = await Chat.findOne({
            _id: req.params.chatId,
            participants: user._id
        });

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Mark all messages from other participants as read
        let updated = false;
        chat.messages.forEach(message => {
            if (message.sender.toString() !== user._id.toString() && !message.read) {
                message.read = true;
                updated = true;
            }
        });

        if (updated) {
            await chat.save();
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ message: error.message });
    }
});

// Delete a chat
router.delete('/:chatId', userMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the chat and make sure the user is a participant
        const chat = await Chat.findOne({
            _id: req.params.chatId,
            participants: user._id
        });

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Mark chat as deleted for this user (rather than deleting it completely)
        await Chat.findByIdAndUpdate(
            req.params.chatId,
            { $addToSet: { deletedBy: user._id } }
        );
        
        // If both participants have deleted the chat, remove it completely
        const updatedChat = await Chat.findById(req.params.chatId);
        if (updatedChat.deletedBy.length >= updatedChat.participants.length) {
            await Chat.findByIdAndDelete(req.params.chatId);
        }
        
        res.json({ success: true, message: 'Chat deleted successfully' });
    } catch (error) {
        console.error('Error deleting chat:', error);
        res.status(500).json({ message: error.message });
    }
});

// Helper function to create a chat when a tool is requested
// This can be imported and used in the tool request handler
const createChatForToolRequest = async (renterId, ownerId) => {
    try {
        // Check if chat already exists (that hasn't been deleted by either user)
        const existingChat = await Chat.findOne({
            participants: { $all: [renterId, ownerId] },
            deletedBy: { $nin: [renterId, ownerId] } // Not deleted by either user
        });

        if (existingChat) {
            return existingChat;
        }

        // If there's a chat deleted by either user, update it by removing users from deletedBy
        const deletedChat = await Chat.findOne({
            participants: { $all: [renterId, ownerId] },
            deletedBy: { $in: [renterId, ownerId] }
        });

        if (deletedChat) {
            // Restore the chat by clearing deletedBy
            deletedChat.deletedBy = [];
            await deletedChat.save();
            return deletedChat;
        }

        // Create new chat if no existing chat is found
        const newChat = new Chat({
            participants: [renterId, ownerId],
            messages: []
        });

        await newChat.save();
        return newChat;
    } catch (error) {
        console.error('Error creating chat for tool request:', error);
        return null;
    }
};

module.exports = router;
module.exports.createChatForToolRequest = createChatForToolRequest; 
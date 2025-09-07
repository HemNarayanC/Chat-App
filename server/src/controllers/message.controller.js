import User from '../models/user.model.js';
import Message from '../models/message.model.js';

const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user.userId;
        const filteredUsers = await User.find({
            _id: {
                $ne: loggedInUserId
            }
        }).select('-password');

        res.status(200).json({
            success: true,
            message: "Users for sidebar fetched",
            filteredUsers
        });
    } catch (error) {
        console.log("Error in getting users for sidebar", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
}

const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user.userId;

        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: userToChatId },
                { sender: userToChatId, receiver: myId }
            ]
        });

        res.status(200).json({
            success: true,
            message: "messages fetched suceessfully",
            messages
        })
    } catch (error) {
        console.log("Error in getting messages", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
}

export {
    getUsersForSidebar,
    getMessages
}
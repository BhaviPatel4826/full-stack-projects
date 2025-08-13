const User = require("../models/user");
const Task = require("../modles/task");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



// @desc   Get all users
// @route  Get /api/users
// @access Private (Admin)
const getUsers = async (req, res) => {
    try {

        const users = await User.find({role: 'member' }).select("-password");

        const usersWithTaskCounts = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({ 
                assignedto: user._id, 
                status: "Pending"
            });
            const inProgressTasks = await Task.countDocuments({ 
                assignedto: user._id, 
                tatus: "In progress"
            });
            const completedTasks = await Task.countDocuments({ assignedto: 
                user._id, 
                status: "Completed"
            });

            return {
                ...user._doc,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            };
        }));

        res.json(usersWithTaskCounts);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: error.message});
    }
}

// @desc   Get user by id
// @route  Get /api/users/(num)
// @access Private
const getUserById = async (req, res) => {
    try {
        const user = await User.getUserById(req.params.user_id).select('-password');

        if(!user) return res.status(404).json({ message: "User not found" });
        res.json(user);

    } catch (err) {
        res.status(500).json({ message: "Server error", error: error.message});
    }
}


module.exports = { getUsers, getUserById }
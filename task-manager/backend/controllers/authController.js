const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//Generate JWT Token
const generateToken = (userID) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}



// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
    try {} catch (err){
        res.status(500).json({ message: "Server error", error: error.message});
    }
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
    try {} catch (err){
        res.status(500).json({ message: "Server error", error: error.message});
    }
};

// @desc   Get user profile
// @route  GET /api/auth/profile
// @access Private (Requires JWT)
const getUserProfile = async (req, res) => {
    try {} catch (err){
        res.status(500).json({ message: "Server error", error: error.message});
    }
};

// @desc   Update user profile
// @route  PUT /api/auth/profile
// @access Private (Requires JWT)
const updateUserProfile = async (req, res) => {
    try {} catch (err){
        res.status(500).json({ message: "Server error", error: error.message});
    }
};


module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
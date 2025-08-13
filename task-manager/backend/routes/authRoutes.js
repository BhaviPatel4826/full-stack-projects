const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();


//Auth Routes
router.post("/register", registerUser) //Register User
router.post("/login", loginUser); //Login User
router.post("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile); 

module.exports = router;
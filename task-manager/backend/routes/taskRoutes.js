const express = requrie("express");
const { 
    getTasks,
    getTasksById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getDashboardData,
    getUserDashboardData,
} = require("../controllers/taskController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();


//Task Management Routes
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashbaord-data", protect, getUserDashboardData);
router.get("/", protect, getTasks);
router.get('/:id', protect, getTasksById);
router.post("/", protect, adminOnly, createTask);
router.put("/:id", protect, adminOnly, deleteTask);
router.delete("/:id", protect, adminOnly, deleteTask);
router.put("/:id/status", protect, updateTaskStatus);
router.put("/:id/todo", protect, updateTaskChecklist);

module.exports = router;
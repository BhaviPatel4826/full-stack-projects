const { attachSpring } = require("framer-motion");
const { create } = require("../models/user");
const Task = require("../modles/task");



// @desc   Get all tasks (Admin: all, User: only assigned tasks)
// @route  Get /api/tasks
// @access Private
const getTasks = async (req, res) => {
    try {

    } catch (error){
        res.status(500).json({ message: "Server error", error: error.message})
    }
}

// @desc   Get task by id
// @route  Get /api/tasks/:id
// @access Private
const getTasksById = async (req, res) => {
    try {

    } catch (error){
        res.status(500).json({ message: "Server error", error: error.message})
    }
}

// @desc   create a new Task
// @route  POST /api/tasks/
// @access Private (Admin)
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            todoChecklist,
        } = req.body

        if(!Array.isArray(assignedTo)){
            return res.status(400).json({ message: "assignedto must be an array of user IDs "});
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            todoChecklist,
            attachments,
        });

        res.status(201).json({ message: "Task created successfully", task});
        
    } catch (error){
        res.status(500).json({ message: "Server error", error: error.message})
    }
}


// @desc   Update task details
// @route  PUT /api/tasks/:id
// @access Private 
const updateTask = async (req, res) => {
    try {

    } catch (error){
        res.status(500).json({ message: "Server error", error: error.message})
    }
}


// @desc   delete a task (Admin only)
// @route  DELETE /api/tasks/
// @access Private (Admin)
const deleteTask = async (req, res) => {
    try {

    } catch (error){
        res.status(500).json({ message: "Server error", error: error.message})
    }
}

// @desc   update task status
// @route  DELETE /api/tasks/:id/status
// @access Private
const updateTaskStatus = async (req, res) => {
    try {

    } catch (error){
        res.status(500).json({ message: "Server error", error: error.message})
    }
}

// @desc   update task checklist
// @route  PUT /api/tasks/:id/todo
// @access Private
const updateTaskChecklist = async (req, res) => {
    try {

    } catch (error){
        res.status(500).json({ message: "Server error", error: error.message})
    }
}


// @desc   dashboard data (Admin only)
// @route  GET /api/tasks/dashboard-data
// @access Private
const getDashboardData = async (req, res) => {
    try {

    } catch (error){
        res.status(500).json({ message: "Server error", error: error.message})
    }
}



// @desc   dashboard data (User-specific)
// @route  GET /api/tasks/user-dashboard-data
// @access Private
const getUserDashboardData = async (req, res) => {
    try {

    } catch (error){
        res.status(500).json({ message: "Server error", error: error.message})
    }
}


module.exports = {
    getTasks,
    getTasksById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getDashboardData,
    getUserDashboardData,
}




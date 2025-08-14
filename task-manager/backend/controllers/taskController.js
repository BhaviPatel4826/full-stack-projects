const { attachSpring } = require("framer-motion");
const { create } = require("../models/user");
const Task = require("../modles/task");



// @desc   Get all tasks (Admin: all, User: only assigned tasks)
// @route  Get /api/tasks
// @access Private
const getTasks = async (req, res) => {
    try {
        const { status } = req.query;

        let filter = {};

        if (status){
            filter.status = status;
        }

        let tasks;

        if(req.user.role === 'admin'){
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user_id }).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        }


        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter(
                        (item) => item.completed
                    ).length;
                return {...task._doc, completedToDoCount: completedCount};
            })
        );

        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user_id }
        );

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "Pending",
            ...(req.user.role !== 'admin' && { assignedTo: req.user._id }),
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "In Progress",
            ...(req.user.role !== 'admin' && { assignedTo: req.user._id }),
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Completed",
            ...(req.user.role !== 'admin' && { assignedTo: req.user._id }),
        });

        res.json({
            tasks,
            statusSummary: {
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            }
        });

    } catch (error){
        res.status(500).json({ message: "Server error", error: error.message})
    }
}

// @desc   Get task by id
// @route  Get /api/tasks/:id
// @access Private
const getTasksById = async (req, res) => {
    try {

        const task = await Tasks.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        if(!task) return res.status(404).json({ message: "Task not found" });

        res.json(task);

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

        const task = await Task.findById(req.params.id);

        if(!task) return res.status(404).message({ message: "Task not found" });

        task.tittle = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;

        if(req.body.assignedTo){
            if(!Array.isArray(req.body.assignedTo)){
                return res.status(400)
                          .json({ message: "assignedTo must be an array of user IDs" });
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updatedTask = await task.save();
        res.json({ message: " Task updated successfully", updatedTask });

    } catch (error){
        res.status(500).json({ message: "Server error", error: error.message})
    }
}


// @desc   delete a task (Admin only)
// @route  DELETE /api/tasks/:id
// @access Private (Admin)
const deleteTask = async (req, res) => {
    try {

        const task = await Task.findById(req.params.id);

        if(!task) return res.status(404).message({ message: "Task not found" });

        await task.deleteOne();

        res.json({ message: "Task deleted successfully" });

    } catch (error){
        res.status(500).json({ message: "Server error", error: error.message})
    }
}

// @desc   update task status
// @route  DELETE /api/tasks/:id/status
// @access Private
const updateTaskStatus = async (req, res) => {
    try {

       
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).message({ message: "Task not found" });

        const isAssignedTo = task.assignedTo.some(
            (userId) => userId.toString() == req.user._id.toString()
        );

        if(!isAssignedTo && req.user.role !== "admin"){
            return res.status(403).json({ message: "Not authorized" });
        }
        task.status = req.body.status || task.status;

        if(task.status === "Completed"){
            task.todoChecklist.forEach((item) => (item.completed = true));
            task.progress = 100;
        }

        await task.save()
        res.json({ message: "Task Status updated successfully", task });

    } catch (error){
        res.status(500).json({ message: "Server error", error: error.message})
    }
}

// @desc   update task checklist
// @route  PUT /api/tasks/:id/todo
// @access Private
const updateTaskChecklist = async (req, res) => {
    try {
        const { todoChecklist } = res.body;

        const task = await Task.findById(req.params.id);

        if(!task) return res.status(404).message({ message: "Task not found" });

        if(!task.assignedTo.includes(req.user._id) && req.user.role !== "admin"){
            return res.status(403).json({ message: "Not authorized to update checklist" });
        }

        task.todoChecklist = todoChecklist;

        const completedCount = task.todoChecklist.filter(
            (item) => item.completed
        );
        const totalItems = task.todoChecklist.length;
        task.progess = totalItems > 0 ? Math.round((completedCount/totalItems) * 100) : 0;

        if(task.progress === 100){
            task.status = "Completed";
        } else if( task.progress  > 0){
            task.status = "In Progress";
        } else {
            task.status = "Pending";
        }

        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        res.json({ message: "Task checklist updated", task:updatedTask });

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




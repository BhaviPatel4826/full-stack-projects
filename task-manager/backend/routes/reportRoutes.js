const express = requrie("express");

const { exportTasksReport, exportUsersReport } = require("../controllers/reportController");
const { adminOnly, protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/export/tasks", protect, adminOnly, exportTasksReport);

router.get("/export/users", protect, adminOnly, exportUsersReport);

module.exports = router;

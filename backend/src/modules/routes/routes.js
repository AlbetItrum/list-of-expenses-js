const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  createNewTask,
  changeTaskInfo,
  deleteTask,
} = require("../controllers/task.controller");

// Tasks routes
router.get("/tasks", getAllTasks);
router.post("/tasks", createNewTask);
router.patch("/tasks", changeTaskInfo);
router.delete("/tasks", deleteTask);

module.exports = router;

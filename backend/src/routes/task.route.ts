import { Router } from "express";
import { createTask, getTasks, getTask, updateTask, updateTaskStatus } from "../controllers/task.controller";

const router = Router();

// Route to get all tasks with filters, search, and pagination
router.get("/tasks", getTasks);

// Route to get a single task by ID
router.get("/tasks/:id", getTask);

// Route to create a new task
router.post("/tasks", createTask);

// Route to update a task by ID
router.put("/tasks/:id", updateTask);

// Route to update status of a task by ID
router.patch("/tasks/:id/status", updateTaskStatus);

export default router;

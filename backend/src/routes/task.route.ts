import { Router } from "express";
import { createTask, getTasks, getTask } from "../controllers/task.controller";

const router = Router();

// Route to get all tasks with filters, search, and pagination
router.get("/tasks", getTasks);

// Route to get a single task by ID
router.get("/tasks/:id", getTask);

// Route to create a new task
router.post("/tasks", createTask);

export default router;

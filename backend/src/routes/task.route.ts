import { Router } from "express";
import { createTask, getTasks } from "../controllers/task.controller";

const router = Router();

// Route to get all tasks with filters, search, and pagination
router.get("/tasks", getTasks);

// Route to create a new task
router.post("/tasks", createTask);

export default router;

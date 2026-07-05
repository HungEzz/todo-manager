import { Router } from "express";
import { createTask } from "../controllers/task.controller";

const router = Router();

// Route to create a new task
router.post("/tasks", createTask);

export default router;

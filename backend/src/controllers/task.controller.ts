import { Request, Response } from "express";
import { z } from "zod";
import * as taskService from "../services/task.service";

const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required and cannot be empty or only whitespace")
    .max(200, "Title cannot exceed 200 characters"),
  description: z.string().optional(),
});

/**
 * Controller to handle task creation.
 */
export const createTask = async (req: Request, res: Response) => {
  try {
    const parseResult = createTaskSchema.safeParse(req.body);
    
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const newTask = await taskService.createTask(parseResult.data);
    return res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

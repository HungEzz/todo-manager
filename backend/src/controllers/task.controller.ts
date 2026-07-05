import { Request, Response } from "express";
import { z } from "zod";
import { TaskStatus } from "@prisma/client";
import * as taskService from "../services/task.service";

// Zod schema for validating task creation request
const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required and cannot be empty or only whitespace")
    .max(200, "Title cannot exceed 200 characters"),
  description: z.string().optional(),
});

// Zod schema for validating task update request
const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required and cannot be empty or only whitespace")
    .max(200, "Title cannot exceed 200 characters")
    .optional(),
  description: z.string().optional(),
});

// Helper for validating positive integer string parameters
const positiveIntStringSchema = (defaultValue: number, name: string) =>
  z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined || val === "") return defaultValue;
      const parsed = Number(val);
      if (isNaN(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
        return null;
      }
      return parsed;
    })
    .refine((val): val is number => val !== null, {
      message: `${name} must be a positive integer`,
    });

// Zod schema for validating get tasks query parameters
const getTasksQuerySchema = z.object({
  status: z.enum(["TODO", "DONE"]).optional(),
  keyword: z.string().optional(),
  page: positiveIntStringSchema(1, "Page"),
  limit: positiveIntStringSchema(10, "Limit"),
  sortBy: z.enum(["createdAt", "title"]).optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
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

/**
 * Controller to handle task retrieval.
 */
export const getTasks = async (req: Request, res: Response) => {
  try {
    const parseResult = getTasksQuerySchema.safeParse(req.query);

    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const result = await taskService.getTasks(parseResult.data);
    return res.status(200).json({
      data: result.tasks,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Controller to handle retrieving a single task by ID.
 */
export const getTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedId = Number(id);

    if (isNaN(parsedId) || !Number.isInteger(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        error: "Invalid ID",
        message: "Task ID must be a valid positive integer",
      });
    }

    const task = await taskService.getTaskById(parsedId);

    if (!task) {
      return res.status(404).json({
        error: "Not Found",
        message: `Task with ID ${parsedId} not found`,
      });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error("Error retrieving task:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Controller to handle task update.
 */
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedId = Number(id);

    if (isNaN(parsedId) || !Number.isInteger(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        error: "Invalid ID",
        message: "Task ID must be a valid positive integer",
      });
    }

    const parseResult = updateTaskSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const updatedTask = await taskService.updateTask(parsedId, parseResult.data);

    if (!updatedTask) {
      return res.status(404).json({
        error: "Not Found",
        message: `Task with ID ${parsedId} not found`,
      });
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};




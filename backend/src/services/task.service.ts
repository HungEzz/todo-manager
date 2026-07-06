import { Prisma, TaskStatus } from "@prisma/client";
import prisma from "../lib/prisma";

/**
 * Creates a new task in the database.
 * @param data Object containing title and optional description.
 */
export const createTask = async (data: { title: string; description?: string; dueDate?: string }) => {
  if (!data.title || data.title.trim() === "") {
    throw new Error("Title is required and cannot be empty");
  }
  return await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    },
  });
};

/**
 * Retrieves list of tasks with pagination, filtering, and search.
 */
export const getTasks = async (params: {
  status?: TaskStatus;
  keyword?: string;
  page: number;
  limit: number;
  sortBy: "createdAt" | "title";
  order: "asc" | "desc";
}) => {
  const { status, keyword, page, limit, sortBy, order } = params;

  const where: Prisma.TaskWhereInput = {};

  if (status) {
    where.status = status;
  }

  if (keyword) {
    where.title = {
      contains: keyword,
      mode: "insensitive",
    };
  }

  const skip = (page - 1) * limit;

  const [tasks, total, activeCount, doneCount] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: order,
      },
    }),
    prisma.task.count({ where }),
    prisma.task.count({ where: { status: "TODO" } }),
    prisma.task.count({ where: { status: "DONE" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    stats: {
      active: activeCount,
      done: doneCount,
    },
  };
};

/**
 * Retrieves a single task by its ID.
 * @param id The ID of the task.
 */
export const getTaskById = async (id: number) => {
  return await prisma.task.findUnique({
    where: { id },
  });
};

/**
 * Updates an existing task with optional new title and description.
 * @param id The ID of the task.
 * @param data Object containing optional title and description.
 */
export const updateTask = async (id: number, data: { title?: string; description?: string; dueDate?: string | null }) => {
  const existing = await prisma.task.findUnique({
    where: { id },
  });
  
  if (!existing) {
    return null;
  }

  const updateData: Prisma.TaskUpdateInput = {
    title: data.title,
    description: data.description,
  };

  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }

  return await prisma.task.update({
    where: { id },
    data: updateData,
  });
};

/**
 * Updates the status of an existing task.
 * @param id The ID of the task.
 * @param status The new status of the task.
 */
export const updateTaskStatus = async (id: number, status: TaskStatus) => {
  const existing = await prisma.task.findUnique({
    where: { id },
  });

  if (!existing) {
    return null;
  }

  return await prisma.task.update({
    where: { id },
    data: { status },
  });
};

/**
 * Deletes a task by its ID.
 * @param id The ID of the task.
 */
export const deleteTask = async (id: number) => {
  const existing = await prisma.task.findUnique({
    where: { id },
  });

  if (!existing) {
    return null;
  }

  return await prisma.task.delete({
    where: { id },
  });
};




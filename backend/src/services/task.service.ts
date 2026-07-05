import prisma from "../lib/prisma";

/**
 * Creates a new task in the database.
 * @param data Object containing title and optional description.
 */
export const createTask = async (data: { title: string; description?: string }) => {
  return await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
    },
  });
};

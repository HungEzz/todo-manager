import prisma from "../lib/prisma";
import * as taskService from "./task.service";
import { TaskStatus } from "@prisma/client";

// Mock the prisma instance exported from ../lib/prisma
jest.mock("../lib/prisma", () => ({
  __esModule: true,
  default: {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

// Cast to mocked object to allow jest control on mock values
const prismaMock = prisma as unknown as {
  task: {
    create: jest.Mock;
    findMany: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    count: jest.Mock;
  };
};

describe("Task Service Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    it("should successfully create a task with valid data", async () => {
      const mockTask = {
        id: 1,
        title: "Test Task",
        description: "Test Description",
        status: TaskStatus.TODO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.task.create.mockResolvedValue(mockTask);

      const result = await taskService.createTask({
        title: "Test Task",
        description: "Test Description",
      });

      expect(result).toEqual(mockTask);
      expect(prismaMock.task.create).toHaveBeenCalledWith({
        data: {
          title: "Test Task",
          description: "Test Description",
        },
      });
    });

    it("should throw an error when creating a task with empty title", async () => {
      await expect(
        taskService.createTask({ title: "" })
      ).rejects.toThrow("Title is required and cannot be empty");

      await expect(
        taskService.createTask({ title: "   " })
      ).rejects.toThrow("Title is required and cannot be empty");

      expect(prismaMock.task.create).not.toHaveBeenCalled();
    });
  });

  describe("getTasks", () => {
    it("should filter by status correctly", async () => {
      const mockTasks = [
        {
          id: 1,
          title: "Task 1",
          description: "Desc 1",
          status: TaskStatus.TODO,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prismaMock.task.findMany.mockResolvedValue(mockTasks);
      prismaMock.task.count.mockResolvedValue(1);

      const result = await taskService.getTasks({
        status: TaskStatus.TODO,
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        order: "desc",
      });

      expect(result.tasks).toEqual(mockTasks);
      expect(result.pagination.total).toBe(1);
      
      expect(prismaMock.task.findMany).toHaveBeenCalledWith({
        where: { status: TaskStatus.TODO },
        skip: 0,
        take: 10,
        orderBy: { createdAt: "desc" },
      });
      expect(prismaMock.task.count).toHaveBeenCalledWith({
        where: { status: TaskStatus.TODO },
      });
    });
  });

  describe("updateTask", () => {
    it("should return null when updating a non-existent task", async () => {
      prismaMock.task.findUnique.mockResolvedValue(null);

      const result = await taskService.updateTask(999, {
        title: "New Title",
      });

      expect(result).toBeNull();
      expect(prismaMock.task.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(prismaMock.task.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteTask", () => {
    it("should return null when deleting a non-existent task", async () => {
      prismaMock.task.findUnique.mockResolvedValue(null);

      const result = await taskService.deleteTask(999);

      expect(result).toBeNull();
      expect(prismaMock.task.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(prismaMock.task.delete).not.toHaveBeenCalled();
    });
  });

  describe("updateTaskStatus (Toggle check)", () => {
    it("should toggle/set status to DONE when current is TODO", async () => {
      const mockTaskTODO = {
        id: 2,
        title: "Task 2",
        description: "Desc 2",
        status: TaskStatus.TODO,
      };
      
      const mockTaskDONE = {
        ...mockTaskTODO,
        status: TaskStatus.DONE,
      };

      prismaMock.task.findUnique.mockResolvedValue(mockTaskTODO);
      prismaMock.task.update.mockResolvedValue(mockTaskDONE);

      const result = await taskService.updateTaskStatus(2, TaskStatus.DONE);

      expect(result).toEqual(mockTaskDONE);
      expect(prismaMock.task.findUnique).toHaveBeenCalledWith({
        where: { id: 2 },
      });
      expect(prismaMock.task.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: { status: TaskStatus.DONE },
      });
    });

    it("should toggle/set status to TODO when current is DONE", async () => {
      const mockTaskDONE = {
        id: 2,
        title: "Task 2",
        description: "Desc 2",
        status: TaskStatus.DONE,
      };
      
      const mockTaskTODO = {
        ...mockTaskDONE,
        status: TaskStatus.TODO,
      };

      prismaMock.task.findUnique.mockResolvedValue(mockTaskDONE);
      prismaMock.task.update.mockResolvedValue(mockTaskTODO);

      const result = await taskService.updateTaskStatus(2, TaskStatus.TODO);

      expect(result).toEqual(mockTaskTODO);
      expect(prismaMock.task.findUnique).toHaveBeenCalledWith({
        where: { id: 2 },
      });
      expect(prismaMock.task.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: { status: TaskStatus.TODO },
      });
    });
  });
});

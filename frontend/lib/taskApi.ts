import { fetchAPI } from "./api";
import { Task, TaskStatus } from "../types/task";

export interface GetTasksParams {
  status?: TaskStatus;
  keyword?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface GetTasksResponse {
  data: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    active: number;
    done: number;
  };
}

/**
 * Fetches tasks with optional search, filtering, sorting, and pagination parameters.
 */
export async function getTasks(params: GetTasksParams = {}): Promise<GetTasksResponse> {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.keyword) query.append("keyword", params.keyword);
  if (params.page !== undefined) query.append("page", String(params.page));
  if (params.limit !== undefined) query.append("limit", String(params.limit));
  if (params.sortBy) query.append("sortBy", params.sortBy);
  if (params.order) query.append("order", params.order);

  const queryString = query.toString();
  return fetchAPI<GetTasksResponse>(`/tasks${queryString ? `?${queryString}` : ""}`);
}

/**
 * Retrieves a single task by its ID.
 */
export async function getTaskById(id: number): Promise<Task> {
  return fetchAPI<Task>(`/tasks/${id}`);
}

/**
 * Creates a new task with title and optional description.
 */
export async function createTask(data: { title: string; description?: string; dueDate?: string }): Promise<Task> {
  return fetchAPI<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Updates an existing task's title and/or description.
 */
export async function updateTask(
  id: number,
  data: { title?: string; description?: string; dueDate?: string | null }
): Promise<Task> {
  return fetchAPI<Task>(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Toggles a task's status between "TODO" and "DONE".
 */
export async function toggleTaskStatus(id: number, currentStatus: TaskStatus): Promise<Task> {
  const newStatus: TaskStatus = currentStatus === "TODO" ? "DONE" : "TODO";

  return fetchAPI<Task>(`/tasks/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: newStatus }),
  });
}

/**
 * Deletes a task by its ID.
 */
export async function deleteTask(id: number): Promise<{ message: string }> {
  return fetchAPI<{ message: string }>(`/tasks/${id}`, {
    method: "DELETE",
  });
}

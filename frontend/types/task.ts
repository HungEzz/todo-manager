export type TaskStatus = "TODO" | "DONE";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
}

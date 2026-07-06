"use client";

import { Task } from "../types/task";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function TaskList({ tasks, loading, error, onRetry }: TaskListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/20 animate-pulse"
          >
            <div className="flex items-center space-x-3 w-2/3">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <div className="space-y-2 w-full">
                <div className="h-4 bg-zinc-800 rounded w-1/3" />
                <div className="h-3 bg-zinc-800 rounded w-2/3" />
              </div>
            </div>
            <div className="h-6 bg-zinc-800 rounded-full w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-red-950/20 border border-red-900/30 rounded-xl space-y-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-red-200">Failed to load tasks</h3>
          <p className="text-sm text-red-400 mt-1 max-w-xs">{error}</p>
        </div>
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-zinc-900/30 border border-zinc-800/50 rounded-xl space-y-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-zinc-200">No tasks found</h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-xs">
            Your task list is empty. Add a new task to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}

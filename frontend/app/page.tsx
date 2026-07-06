"use client";

import { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import { Task } from "../types/task";
import { getTasks } from "../lib/taskApi";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = () => {
    setLoading(true);
    setError(null);
    getTasks()
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load tasks");
        setLoading(false);
      });
  };

  useEffect(() => {
    let active = true;
    getTasks()
      .then((res) => {
        if (active) {
          setTasks(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Failed to load tasks");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white font-sans py-16 px-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 sm:text-5xl">
            Todo List App
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base font-medium">
            Manage your daily tasks intelligently
          </p>
        </div>

        {/* Form to create new tasks */}
        <TaskForm onTaskCreated={handleTaskCreated} />

        {/* Task List Container */}
        <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-md shadow-xl">
          <TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            onRetry={loadTasks}
          />
        </div>
      </div>
    </main>
  );
}

"use client";

import React, { useState } from "react";
import { createTask } from "../lib/taskApi";
import { Task } from "../types/task";

interface TaskFormProps {
  onTaskCreated: (task: Task) => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const [titleError, setTitleError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    
    // Real-time client-side validation
    if (val.trim() === "") {
      setTitleError("Title is required and cannot be empty");
    } else if (val.length > 200) {
      setTitleError("Title cannot exceed 200 characters");
    } else {
      setTitleError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final checks before sending request
    if (title.trim() === "") {
      setTitleError("Title is required and cannot be empty");
      return;
    }
    if (title.length > 200) {
      setTitleError("Title cannot exceed 200 characters");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const newTask = await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      // Reset form states on success
      setTitle("");
      setDescription("");
      setTitleError(null);
      
      // Notify parent to append the task
      onTaskCreated(newTask);
    } catch (err) {
      // API error - retain user input, show error message
      const errorMessage = err instanceof Error ? err.message : "Failed to create a new task. Please try again.";
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmitDisabled = submitting || !!titleError || title.trim() === "";

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-md shadow-xl space-y-4"
    >
      <h2 className="text-xl font-bold text-zinc-100">Create New Task</h2>

      {/* Global API Submit Error */}
      {submitError && (
        <div className="p-3 text-sm rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
          {submitError}
        </div>
      )}

      {/* Title Field */}
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-xs font-semibold text-zinc-400">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter task title..."
          className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-zinc-950/50 text-white placeholder-zinc-600 focus:outline-none transition-all ${
            titleError
              ? "border-red-500/50 focus:border-red-500"
              : "border-zinc-800 focus:border-indigo-500"
          }`}
        />
        {titleError && (
          <p className="text-xs text-red-400 font-medium">{titleError}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="text-xs font-semibold text-zinc-400">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter detailed description (optional)..."
          rows={3}
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-800 bg-zinc-950/50 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-all resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="w-full py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] transition-all"
      >
        {submitting ? "Processing..." : "Add Task"}
      </button>
    </form>
  );
}

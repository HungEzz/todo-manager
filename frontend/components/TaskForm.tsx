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
  const [dueDate, setDueDate] = useState("");
  
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
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });

      // Reset form states on success
      setTitle("");
      setDescription("");
      setDueDate("");
      setTitleError(null);
      
      onTaskCreated(newTask);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create a new task. Please try again.";
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmitDisabled = submitting || !!titleError || title.trim() === "";
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 rounded-2xl border border-border/60 bg-surface/50 transition-all duration-200 space-y-2"
    >
      {/* Global API Submit Error */}
      {submitError && (
        <div className="p-2.5 text-xs rounded-lg border-l-4 border-error bg-error-bg text-error">
          {submitError}
        </div>
      )}

      {/* Main row */}
      <div className="flex gap-2 items-start">
        <div className="flex-1 space-y-1">
          <label htmlFor="title" className="sr-only">Task Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            onFocus={() => setIsExpanded(true)}
            placeholder="Add a new task..."
            className={`w-full px-2.5 py-1.5 text-xs rounded-lg border bg-white text-ink placeholder-muted focus:outline-none transition-all ${
              titleError
                ? "border-error focus:border-error"
                : "border-border focus:border-primary"
            }`}
          />
        </div>
        {!isExpanded && (
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
          >
            {submitting ? "..." : "Add"}
          </button>
        )}
      </div>

      {titleError && isExpanded && (
        <p className="text-[10px] text-error font-medium mt-0.5">{titleError}</p>
      )}

      {isExpanded && (
        <div className="pt-2 border-t border-border/60 space-y-2.5">
          <div className="space-y-1">
            <label htmlFor="description" className="sr-only">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description (optional)..."
              rows={2}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-white text-ink placeholder-muted focus:outline-none focus:border-primary transition-all resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex-1 flex items-center gap-1.5">
              <span className="text-muted text-[10px] font-bold select-none">Due:</span>
              <input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="flex-1 px-2 py-1 text-xs rounded-lg border border-border bg-white text-ink focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="flex justify-end gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setTitleError(null);
                  setDueDate("");
                }}
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-border bg-white text-muted hover:text-ink transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="px-3.5 py-1 text-[11px] font-bold rounded-lg text-white bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] transition-all cursor-pointer"
              >
                {submitting ? "..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

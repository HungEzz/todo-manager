import { useState } from "react";
import { Task } from "../types/task";
import { updateTask } from "../lib/taskApi";

interface TaskItemProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
}

export default function TaskItem({ task, onTaskUpdated }: TaskItemProps) {
  const isDone = task.status === "DONE";
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");

  const [titleError, setTitleError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editTitle.trim() === "") {
      setTitleError("Title is required and cannot be empty");
      return;
    }
    if (editTitle.length > 200) {
      setTitleError("Title cannot exceed 200 characters");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const updatedTask = await updateTask(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });

      onTaskUpdated(updatedTask);
      setIsEditing(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update the task. Please try again.";
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleUpdate}
        className="p-4 rounded-xl border border-indigo-500/50 bg-zinc-900/50 backdrop-blur-sm space-y-3"
      >
        {submitError && (
          <div className="p-2.5 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            {submitError}
          </div>
        )}

        <div className="space-y-1">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => {
              const val = e.target.value;
              setEditTitle(val);
              if (val.trim() === "") {
                setTitleError("Title is required and cannot be empty");
              } else if (val.length > 200) {
                setTitleError("Title cannot exceed 200 characters");
              } else {
                setTitleError(null);
              }
            }}
            placeholder="Task title..."
            className={`w-full px-3 py-1.5 text-sm rounded-lg border bg-zinc-950/60 text-white placeholder-zinc-600 focus:outline-none transition-all ${
              titleError
                ? "border-red-500/50 focus:border-red-500"
                : "border-zinc-800 focus:border-indigo-500"
            }`}
          />
          {titleError && (
            <p className="text-xs text-red-400 font-medium">{titleError}</p>
          )}
        </div>

        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Task description (optional)..."
          rows={2}
          className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-800 bg-zinc-950/60 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-all resize-none"
        />

        <div className="flex justify-end space-x-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditTitle(task.title);
              setEditDescription(task.description || "");
              setTitleError(null);
              setSubmitError(null);
            }}
            disabled={submitting}
            className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !!titleError || editTitle.trim() === ""}
            className="px-3 py-1.5 rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] transition-all"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700 transition-all duration-200">
      <div className="flex items-center space-x-3 min-w-0">
        <span
          className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${
            isDone ? "bg-green-500 shadow-lg shadow-green-500/50" : "bg-blue-500 shadow-lg shadow-blue-500/50"
          }`}
        />
        <div className="min-w-0">
          <p
            className={`text-sm font-semibold truncate ${
              isDone ? "text-zinc-500 line-through font-normal" : "text-zinc-100"
            }`}
          >
            {task.title}
          </p>
          {task.description && (
            <p
              className={`text-xs mt-0.5 truncate ${
                isDone ? "text-zinc-600 line-through" : "text-zinc-400"
              }`}
            >
              {task.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
            isDone
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-blue-500/10 border-blue-500/20 text-blue-400"
          }`}
        >
          {task.status}
        </span>
        <button
          onClick={() => setIsEditing(true)}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-95 transition-all"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Task, TaskStatus } from "../types/task";
import { updateTask, deleteTask, toggleTaskStatus } from "../lib/taskApi";

interface TaskItemProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (id: number) => void;
}

export default function TaskItem({ task, onTaskUpdated, onTaskDeleted }: TaskItemProps) {
  const isDone = task.status === "DONE";
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toLocalISO = (dateStr: string | null) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - (offset * 60 * 1000));
      return localDate.toISOString().slice(0, 16);
    } catch (e) {
      return "";
    }
  };

  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [editDueDate, setEditDueDate] = useState(toLocalISO(task.dueDate));

  const [titleError, setTitleError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toggling, setToggling] = useState(false);

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
        dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
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

  const handleDelete = async () => {
    setDeleting(true);
    setSubmitError(null);

    try {
      await deleteTask(task.id);
      onTaskDeleted(task.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete the task. Please try again.";
      setSubmitError(errorMessage);
      setIsConfirmingDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (toggling) return;

    setToggling(true);
    setSubmitError(null);

    const originalTask = { ...task };
    const nextStatus: TaskStatus = task.status === "TODO" ? "DONE" : "TODO";
    const optimisticTask: Task = {
      ...task,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    };

    onTaskUpdated(optimisticTask);

    try {
      const actualUpdatedTask = await toggleTaskStatus(task.id, task.status);
      onTaskUpdated(actualUpdatedTask);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update task status. Please try again.";
      setSubmitError(errorMessage);
      onTaskUpdated(originalTask);
    } finally {
      setToggling(false);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "12:00 PM";
    }
  };

  const formatDueDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return dateStr;
    }
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleUpdate}
        className="p-3 bg-surface/50 border border-border/60 rounded-2xl space-y-2"
      >
        {submitError && (
          <div className="p-2.5 text-xs rounded-lg border-l-4 border-error bg-error-bg text-error">
            {submitError}
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="edit-title" className="sr-only">Edit title</label>
          <input
            id="edit-title"
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
            className={`w-full px-2.5 py-1 text-xs rounded-lg border bg-white text-ink placeholder-muted focus:outline-none transition-all ${
              titleError
                ? "border-error focus:border-error"
                : "border-border focus:border-primary"
            }`}
          />
          {titleError && (
            <p className="text-[10px] text-error font-medium">{titleError}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="edit-description" className="sr-only">Edit description</label>
          <textarea
            id="edit-description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Edit description (optional)..."
            rows={2}
            className="w-full px-2.5 py-1 text-xs rounded-lg border border-border bg-white text-ink placeholder-muted focus:outline-none focus:border-primary transition-all resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex-1 flex items-center gap-1.5">
            <span className="text-muted text-[10px] font-bold select-none">Due:</span>
            <input
              id="edit-dueDate"
              type="datetime-local"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-border bg-white text-ink focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <div className="flex justify-end gap-1.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditTitle(task.title);
                setEditDescription(task.description || "");
                setEditDueDate(toLocalISO(task.dueDate));
                setTitleError(null);
                setSubmitError(null);
              }}
              disabled={submitting}
              className="px-2.5 py-1 rounded-lg border border-border bg-white text-muted hover:text-ink transition-all disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !!titleError || editTitle.trim() === ""}
              className="px-3.5 py-1 rounded-lg text-white bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] transition-all cursor-pointer"
            >
              {submitting ? "..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col p-4 bg-white border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 space-y-2.5">
      {submitError && (
        <div className="p-2.5 text-xs rounded-lg bg-error-bg border-l-4 border-error text-error flex justify-between items-center">
          <span>{submitError}</span>
          <button
            onClick={() => setSubmitError(null)}
            className="text-error hover:text-ink font-bold ml-2 transition-colors cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Main card row: Checkbox and content wrapper */}
      <div className="flex items-start gap-3">
        {/* Checkbox button */}
        <button
          onClick={handleToggleStatus}
          disabled={toggling || isConfirmingDelete}
          title={isDone ? "Mark as TODO" : "Mark as DONE"}
          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer mt-0.5 ${
            isDone
              ? "bg-primary border-primary text-white"
              : "border-slate-300 bg-white text-transparent hover:border-primary hover:bg-primary/5"
          } active:scale-90 disabled:opacity-50`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        {/* Content & responsive actions block */}
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Title and Description */}
          <div className="min-w-0 flex-1">
            <span
              className={`text-sm select-none inline-block max-w-full truncate task-title ${
                isDone ? "task-title-done text-muted font-normal" : "text-ink font-semibold"
              }`}
            >
              {task.title}
            </span>
            {task.description && (
              <p
                className={`text-xs mt-0.5 truncate ${
                  isDone ? "text-muted opacity-70 line-through" : "text-muted"
                }`}
              >
                {task.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2.5 mt-1 select-none">
              <div className="flex items-center gap-1 text-[10px] font-semibold text-muted">
                <svg className="w-3 h-3 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatTime(task.createdAt)}</span>
              </div>
              {task.dueDate && (
                <div className={`flex items-center gap-1 text-[10px] font-bold ${isDone ? "text-muted opacity-70 line-through" : "text-primary"}`}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Due: {formatDueDate(task.dueDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Badge & Action Buttons */}
          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-border/50 mt-1 sm:mt-0 flex-shrink-0 w-full sm:w-auto">
            {isConfirmingDelete ? (
              <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-xs text-error font-semibold animate-pulse mr-1">
                  Are you sure?
                </span>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-error hover:opacity-95 text-white active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {deleting ? "..." : "Delete"}
                  </button>
                  <button
                    onClick={() => setIsConfirmingDelete(false)}
                    disabled={deleting}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-border bg-white text-muted hover:text-ink active:scale-95 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    isDone ? "text-accent" : "text-muted"
                  }`}
                >
                  {isDone ? "Done" : "Todo"}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-border bg-white text-muted hover:text-ink hover:border-primary active:scale-95 transition-all cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setIsConfirmingDelete(true)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-border bg-white text-error hover:bg-error-bg hover:border-error active:scale-95 transition-all cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

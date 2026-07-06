"use client";

import { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import { Task } from "../types/task";
import { getTasks } from "../lib/taskApi";

type SortType = "NEWEST" | "OLDEST" | "TITLE_ASC" | "TITLE_DESC";

const getSortParams = (opt: SortType) => {
  switch (opt) {
    case "NEWEST":
      return { sortBy: "createdAt", order: "desc" as const };
    case "OLDEST":
      return { sortBy: "createdAt", order: "asc" as const };
    case "TITLE_ASC":
      return { sortBy: "title", order: "asc" as const };
    case "TITLE_DESC":
      return { sortBy: "title", order: "desc" as const };
  }
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter states
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "TODO" | "DONE">("ALL");

  // Sorting and pagination states
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState<SortType>("NEWEST");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Debounce effect for search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1); // Reset to page 1 on query changes
    }, 350);
    return () => clearTimeout(handler);
  }, [keyword]);

  const loadTasks = () => {
    setLoading(true);
    setError(null);

    const sortParams = getSortParams(sortOption);
    const params = {
      keyword: debouncedKeyword.trim() || undefined,
      status: statusFilter === "ALL" ? undefined : statusFilter,
      page,
      limit: 10,
      ...sortParams,
    };

    getTasks(params)
      .then((res) => {
        setTasks(res.data);
        setPagination(res.pagination);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load tasks");
        setLoading(false);
      });
  };

  // Reload tasks whenever search, status filter, sorting options, or page changes
  useEffect(() => {
    let active = true;

    Promise.resolve().then(() => {
      if (active) {
        setLoading(true);
        setError(null);
      }
    });

    const sortParams = getSortParams(sortOption);
    const params = {
      keyword: debouncedKeyword.trim() || undefined,
      status: statusFilter === "ALL" ? undefined : statusFilter,
      page,
      limit: 10,
      ...sortParams,
    };

    getTasks(params)
      .then((res) => {
        if (active) {
          setTasks(res.data);
          setPagination(res.pagination);
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
  }, [debouncedKeyword, statusFilter, sortOption, page]);

  const handleTaskCreated = () => {
    // Reload tasks to respect current filters and search keyword
    loadTasks();
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleTaskDeleted = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
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

        {/* Search, Filter & Sort Controls */}
        <div className="space-y-3">
          {/* Row 1: Search & Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search bar */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search tasks by title..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-900/40 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Sort Select */}
            <div className="relative self-start sm:self-auto">
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value as SortType);
                  setPage(1);
                }}
                className="w-full sm:w-auto pl-3 pr-8 py-2 text-sm font-semibold rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-300 focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value="NEWEST">Newest</option>
                <option value="OLDEST">Oldest</option>
                <option value="TITLE_ASC">Title A-Z</option>
                <option value="TITLE_DESC">Title Z-A</option>
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          {/* Row 2: Status Tabs */}
          <div className="flex bg-zinc-900/60 p-1 rounded-xl border border-zinc-800 self-start">
            {(["ALL", "TODO", "DONE"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setStatusFilter(filter);
                  setPage(1);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  statusFilter === filter
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {filter === "ALL" ? "All" : filter === "TODO" ? "Active" : "Completed"}
              </button>
            ))}
          </div>
        </div>

        {/* Task List Container */}
        <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-md shadow-xl space-y-6">
          <TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            onRetry={loadTasks}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
            isFiltered={debouncedKeyword.trim() !== "" || statusFilter !== "ALL"}
          />

          {/* Pagination Controls */}
          {!loading && !error && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80 text-xs font-semibold text-zinc-400">
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950/20 hover:text-white hover:border-zinc-700 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950/20 hover:text-white hover:border-zinc-700 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

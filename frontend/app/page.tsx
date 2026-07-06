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

  const [showForm, setShowForm] = useState(false);
  const [globalStats, setGlobalStats] = useState({ active: 0, done: 0 });

  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [silentReload, setSilentReload] = useState(false);
  const [showColdStartWarning, setShowColdStartWarning] = useState(false);

  // Show cold start warning banner if loading takes more than 4 seconds
  useEffect(() => {
    let warningTimer: NodeJS.Timeout;
    if (loading && !silentReload) {
      warningTimer = setTimeout(() => {
        setShowColdStartWarning(true);
      }, 4000);
    } else {
      setShowColdStartWarning(false);
    }
    return () => clearTimeout(warningTimer);
  }, [loading, silentReload]);

  // Debounce effect for search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1); 
    }, 350);
    return () => clearTimeout(handler);
  }, [keyword]);

  // Reload tasks whenever search, status filter, sorting options, page, or reloadTrigger changes
  useEffect(() => {
    let active = true;

    if (!silentReload) {
      setLoading(true);
    }
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
        if (active) {
          setTasks(res.data);
          setPagination(res.pagination);
          setGlobalStats(res.stats || { active: 0, done: 0 });
          setLoading(false);
          setSilentReload(false); 
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Failed to load tasks");
          setLoading(false);
          setSilentReload(false); 
        }
      });

    return () => {
      active = false;
    };
  }, [debouncedKeyword, statusFilter, sortOption, page, reloadTrigger]);

  const handleTaskCreated = () => {
    setSilentReload(false);
    setReloadTrigger((prev) => prev + 1);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setSilentReload(true);
    setReloadTrigger((prev) => prev + 1);
  };

  const handleTaskDeleted = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setSilentReload(true);
    setReloadTrigger((prev) => prev + 1);
  };

  const handleRetry = () => {
    setSilentReload(false);
    setReloadTrigger((prev) => prev + 1);
  };


  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
    return new Date().toLocaleDateString("en-US", options);
  };

  const activeCount = globalStats.active;
  const doneCount = globalStats.done;

  return (
    <main className="flex min-h-screen flex-col items-center justify-start lg:justify-center py-0 lg:py-10 px-0 lg:px-4">
      {/* Responsive layout */}
      <div className="w-full max-w-full sm:max-w-[480px] md:max-w-[520px] lg:max-w-[960px] xl:max-w-[1024px] bg-white rounded-none sm:rounded-[32px] shadow-none sm:shadow-xl sm:shadow-ink/5 border-0 sm:border border-border/60 flex flex-col lg:flex-row h-screen sm:h-[680px] lg:h-[720px] relative overflow-hidden">
        {/* Left Column: Sidebar */}
        <div className="flex flex-col lg:w-[250px] lg:flex-shrink-0 bg-white lg:bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-border/50 justify-between lg:h-full">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-row justify-between items-center pb-1 lg:pb-0">
              <div className="space-y-0.5 lg:hidden">
                <h1 className="text-2xl font-extrabold tracking-tight text-ink font-body leading-tight whitespace-nowrap">
                  My Tasks
                </h1>
                <p className="text-muted text-[11px] font-semibold whitespace-nowrap">
                  Today is {getFormattedDate()}
                </p>
              </div>
              <div className="h-9 flex items-center select-none">
                <img
                  src="https://srtgroup.vn/wp-content/uploads/2025/10/Asset-1@2x.png"
                  alt="SRT Logo"
                  className="h-6 w-auto object-contain"
                />
              </div>
            </div>

            {/* Desktop Sidebar Navigation */}
            <div className="hidden lg:flex flex-col space-y-1">
              <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2 px-3">Filters</p>
              {(["ALL", "TODO", "DONE"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setStatusFilter(filter);
                    setPage(1);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border-l-4 ${
                    statusFilter === filter
                      ? "bg-primary/5 text-primary border-primary"
                      : "text-muted hover:bg-surface hover:text-ink border-transparent"
                  }`}
                >
                  <span className="text-sm">
                    {filter === "ALL" ? "📋" : filter === "TODO" ? "📂" : "✅"}
                  </span>
                  <span>
                    {filter === "ALL" ? "All Tasks" : filter === "TODO" ? "Active" : "Completed"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 min-w-0 flex flex-col p-4 sm:p-6 lg:p-8 space-y-5 lg:space-y-6 h-full overflow-hidden bg-white">
          {/* Desktop Main Page Title */}
          <div className="hidden lg:block space-y-0.5 pb-1 select-none">
            <h1 className="text-3xl font-extrabold tracking-tight text-ink font-body leading-none">
              My Tasks
            </h1>
            <p className="text-muted text-xs font-semibold mt-1.5">
              Today is {getFormattedDate()}
            </p>
          </div>

          {/* Render cold start warning if API loading is slow */}
          {showColdStartWarning && (
            <div className="p-3 text-xs font-semibold rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-2.5 animate-pulse select-none">
              <span className="text-sm">☕</span>
              <span>API server is waking up (Render Free Tier). Please wait up to 50 seconds for the first load...</span>
            </div>
          )}

        {/* Stats Category Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {/* Active Tasks Card */}
          <div className="bg-white border border-border/60 p-3 sm:p-3.5 rounded-2xl flex items-center gap-2.5 sm:gap-3.5 shadow-sm hover:shadow-md transition-shadow select-none">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-muted uppercase tracking-wider leading-none">Active</p>
              <p className="text-xs sm:text-sm font-extrabold text-ink mt-1 sm:mt-1.5 leading-none">{activeCount} Tasks</p>
            </div>
          </div>

          {/* Completed Tasks Card */}
          <div className="bg-white border border-border/60 p-3 sm:p-3.5 rounded-2xl flex items-center gap-2.5 sm:gap-3.5 shadow-sm hover:shadow-md transition-shadow select-none">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/5 text-accent flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-muted uppercase tracking-wider leading-none">Completed</p>
              <p className="text-xs sm:text-sm font-extrabold text-ink mt-1 sm:mt-1.5 leading-none">{doneCount} Done</p>
            </div>
          </div>

          {/* Total Tasks Card */}
          <div className="bg-white border border-border/60 p-3 sm:p-3.5 rounded-2xl flex items-center gap-2.5 sm:gap-3.5 shadow-sm hover:shadow-md transition-shadow select-none">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-500/5 text-slate-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-muted uppercase tracking-wider leading-none">Total</p>
              <p className="text-xs sm:text-sm font-extrabold text-ink mt-1 sm:mt-1.5 leading-none">{pagination.total || tasks.length} Tasks</p>
            </div>
          </div>
        </div>

          {/* Form panel */}
          {showForm && (
            <TaskForm onTaskCreated={(t) => {
              handleTaskCreated();
            }} />
          )}

          {/* List Title & Search/Sort controls */}
          <div className="space-y-3.5">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-ink">On Going</h2>
              <div className="flex space-x-3.5 lg:hidden">
                {(["ALL", "TODO", "DONE"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setStatusFilter(filter);
                      setPage(1);
                    }}
                    className={`text-[11px] font-bold pb-0.5 border-b-2 cursor-pointer transition-all ${
                      statusFilter === filter
                        ? "border-primary text-primary"
                        : "border-transparent text-muted hover:text-ink"
                    }`}
                  >
                    {filter === "ALL" ? "All" : filter === "TODO" ? "Active" : "Done"}
                  </button>
                ))}
              </div>
            </div>

            {/* Search bar & Sort selector */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-muted">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <label htmlFor="search-input" className="sr-only">Search tasks</label>
                <input
                  id="search-input"
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search task by title..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-surface text-ink placeholder-muted focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="relative flex-shrink-0">
                <label htmlFor="sort-select" className="sr-only">Sort option</label>
                <select
                  id="sort-select"
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value as SortType);
                    setPage(1);
                  }}
                  className="w-full pl-2 pr-6 py-1.5 text-xs font-bold rounded-lg border border-border bg-surface text-ink focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="NEWEST">Newest</option>
                  <option value="OLDEST">Oldest</option>
                  <option value="TITLE_ASC">A-Z</option>
                  <option value="TITLE_DESC">Z-A</option>
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-muted">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Task list */}
          <div className="flex-1 overflow-y-auto space-y-3 pb-16">
            <TaskList
              tasks={tasks}
              loading={loading}
              error={error}
              onRetry={handleRetry}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
              isFiltered={debouncedKeyword.trim() !== "" || statusFilter !== "ALL"}
            />

            {/* Pagination Controls */}
            {!loading && !error && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-3 border-t border-border text-[10px] font-bold text-muted">
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <div className="flex space-x-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={pagination.page <= 1}
                    className="px-2 py-1 rounded-lg border border-border bg-white text-muted hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-2 py-1 rounded-lg border border-border bg-white text-muted hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Floating Add Task Button */}
          <div className="absolute bottom-5 right-5 z-20">
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-[#E25356] hover:opacity-95 text-white flex items-center justify-center shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title={showForm ? "Close Form" : "Add New Task"}
            >
              <span className="text-2xl font-bold leading-none">{showForm ? "×" : "+"}</span>
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}

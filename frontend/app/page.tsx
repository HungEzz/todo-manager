import TaskList from "../components/TaskList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white font-sans py-16 px-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 sm:text-5xl">
            Todo List App
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base font-medium">
            Quản lý công việc hàng ngày một cách thông minh
          </p>
        </div>

        {/* Task List Container */}
        <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-md shadow-xl">
          <TaskList />
        </div>
      </div>
    </main>
  );
}

import { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const isDone = task.status === "DONE";

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
      <span
        className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
          isDone
            ? "bg-green-500/10 border-green-500/20 text-green-400"
            : "bg-blue-500/10 border-blue-500/20 text-blue-400"
        }`}
      >
        {task.status}
      </span>
    </div>
  );
}

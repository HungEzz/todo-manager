export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white font-sans">
      <div className="text-center space-y-4 px-4">
        <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 sm:text-6xl">
          Todo List App
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg max-w-md mx-auto font-medium">
          Welcome to your premium task manager. Next.js frontend project has been successfully initialized!
        </p>
      </div>
    </main>
  );
}

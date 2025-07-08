export default function App() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 text-gray-900">
            <header className="flex items-center justify-center gap-2 mb-6 w-full">
                <span className="text-4xl">🎓</span>
                <h1 className="text-4xl font-bold">Studium</h1>
            </header>

            <main className="w-full max-w-xl flex flex-col items-center text-center space-y-4">
                <p className="text-lg">🧙‍♂️ "Welcome, brave soul."</p>
                <p className="font-semibold">Novice</p>
                <p>
                    XP: <span className="font-bold">0</span> | 🔥 Streak: <span className="font-bold">0</span>
                </p>
                <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition">
                    Complete Quest
                </button>

                <div className="mt-10 text-left w-full">
                    <h2 className="text-2xl font-bold">🏆 Leaderboard</h2>
                    {/* Your leaderboard entries here */}
                </div>
            </main>
        </div>
    );
}

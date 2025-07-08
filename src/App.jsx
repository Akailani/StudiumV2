import React, { useState } from "react";
import Confetti from "react-confetti";
import Leaderboard from "./Leaderboard";

export default function App() {
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState(0);
    const [title, setTitle] = useState("Adventurer");
    const [message, setMessage] = useState("Welcome, brave soul.");
    const [showConfetti, setShowConfetti] = useState(false);

    const completeQuest = () => {
        const newXp = xp + 50;
        const newStreak = streak + 1;
        setXp(newXp);
        setStreak(newStreak);
        setShowConfetti(true);

        setTimeout(() => setShowConfetti(false), 3000);

        if (newXp >= 500) {
            setTitle("Archmage");
            setMessage("Your wisdom radiates across the land.");
        } else if (newXp >= 300) {
            setTitle("Wizard");
            setMessage("You gained 50 XP! Now you're a Wizard!");
        } else if (newXp >= 150) {
            setTitle("Apprentice");
            setMessage("You're learning quickly, Apprentice!");
        } else {
            setTitle("Adventurer");
            setMessage("Quest complete! Keep going!");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            {showConfetti && <Confetti />}
            <div className="text-center max-w-xl w-full p-4">
                <h1 className="text-4xl font-bold mb-6 flex justify-center items-center gap-2">
                    🎓 Studium
                </h1>
                <div className="mb-4">
                    <p className="text-lg mb-1">🧙‍♂️ "{message}"</p>
                    <p className="font-medium text-gray-700">{title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                        XP: {xp} | 🔥 Streak: {streak}
                    </p>
                </div>
                <button
                    onClick={completeQuest}
                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
                >
                    Complete Quest
                </button>

                <div className="mt-8 text-left">
                    <h2 className="text-2xl font-semibold mb-2">🏆 Leaderboard</h2>
                    <Leaderboard />
                </div>
            </div>
        </div>
    );
}

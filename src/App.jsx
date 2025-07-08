// src/App.jsx

import React, { useState } from "react";
import Confetti from "react-confetti";

const titles = [
    { level: 0, name: "Novice" },
    { level: 50, name: "Adventurer" },
    { level: 200, name: "Scholar" },
    { level: 500, name: "Wizard" },
    { level: 1000, name: "Master" },
    { level: 1400, name: "Grandmaster" },
];

export default function App() {
    const [xp, setXP] = useState(0);
    const [streak, setStreak] = useState(0);
    const [message, setMessage] = useState("Welcome, brave soul.");
    const [showConfetti, setShowConfetti] = useState(false);

    const currentTitle = titles
        .slice()
        .reverse()
        .find((title) => xp >= title.level)?.name || "Novice";

    const handleCompleteQuest = () => {
        const newXP = xp + 50;
        const newStreak = streak + 1;
        setXP(newXP);
        setStreak(newStreak);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);

        const newTitle = titles
            .slice()
            .reverse()
            .find((title) => newXP >= title.level)?.name;

        if (newTitle && newTitle !== currentTitle) {
            setMessage(`You are now a ${newTitle} of Studium!`);
        } else {
            setMessage(`You gained 50 XP! Now you're a ${currentTitle}!`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-center px-4">
            {showConfetti && <Confetti />}
            <h1 className="text-4xl font-bold mb-6">🎓 Studium</h1>
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
                <p className="mb-2 text-lg">🧙 "{message}"</p>
                <p className="font-semibold mb-2">{currentTitle}</p>
                <p className="mb-4">
                    XP: <strong>{xp}</strong> | 🔥 Streak: <strong>{streak}</strong>
                </p>
                <button
                    onClick={handleCompleteQuest}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
                >
                    Complete Quest
                </button>
            </div>
            <div className="mt-10">
                <h2 className="text-2xl font-bold">🏆 Leaderboard</h2>
            </div>
        </div>
    );
}

import React, { useState } from "react";
import Confetti from "react-confetti";
import "./index.css";

const titles = [
    "Novice", "Apprentice", "Adept", "Scholar", "Mage",
    "Wizard", "Master", "Sage", "Grandmaster", "Legend"
];

const messages = [
    "Welcome, brave soul.",
    "You've taken your first step into Studium.",
    "The path is long, but you are not alone.",
    "Knowledge is your weapon. Go forth.",
    "Wisdom grows within you.",
    "The flame of discipline burns bright.",
    "You are ascending the tower of mastery.",
    "You wield the arcane forces of learning.",
    "The world will remember your dedication.",
    "You are now a Grandmaster of Studium!"
];

export default function App() {
    const [xp, setXP] = useState(0);
    const [streak, setStreak] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    const titleIndex = Math.min(Math.floor(xp / 150), titles.length - 1);
    const title = titles[titleIndex];
    const message = messages[titleIndex];

    const handleQuestComplete = () => {
        const newXP = xp + 50;
        setXP(newXP);
        setStreak(streak + 1);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-6">
                {showConfetti && <Confetti />}
                <h1 className="text-3xl font-bold text-center mb-6">🎓 Studium</h1>
                <div className="space-y-4 text-center">
                    <p>🧙 "{message}"</p>
                    <p className="font-semibold">{title}</p>
                    <p>XP: {xp} <span role="img" aria-label="fire">🔥</span> Streak: {streak}</p>
                    <button
                        onClick={handleQuestComplete}
                        className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded shadow"
                    >
                        Complete Quest
                    </button>
                </div>
                <div className="mt-6 text-left">
                    <h2 className="text-xl font-bold mb-2">🏆 Leaderboard</h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li><strong>You</strong> — {xp} XP</li>
                        {/* Add more players later */}
                    </ul>
                </div>
            </div>
        </div>
    );
}

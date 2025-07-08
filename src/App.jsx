import React, { useState } from "react";
import Confetti from "react-confetti";
import Leaderboard from "./Leaderboard";

const titles = [
    { title: "Novice", level: 0 },
    { title: "Adventurer", level: 100 },
    { title: "Scholar", level: 200 },
    { title: "Wizard", level: 300 },
    { title: "Grandmaster", level: 500 },
];

function getTitleForXP(xp) {
    const current = titles
        .slice()
        .reverse()
        .find((t) => xp >= t.level);
    return current ? current.title : "Novice";
}

function getMessageForXP(xp) {
    if (xp >= 500) return '🌟 "You are now a Grandmaster of Studium!"';
    if (xp >= 300) return '🧙 "You gained 50 XP! Now you\'re a Wizard!"';
    if (xp >= 200) return '📘 "You are now a Scholar!"';
    if (xp >= 100) return '🧭 "You are now an Adventurer!"';
    if (xp > 0) return '📚 "Keep going! You\'re learning!"';
    return '🧙‍♂️ "Welcome, brave soul."';
}

function App() {
    const [xp, setXP] = useState(0);
    const [streak, setStreak] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    const title = getTitleForXP(xp);
    const wizardMessage = getMessageForXP(xp);

    const handleCompleteQuest = () => {
        const newXP = xp + 50;
        const newStreak = streak + 1;
        setXP(newXP);
        setStreak(newStreak);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] flex items-center justify-center">
            {showConfetti && <Confetti />}
            <div className="flex flex-col items-center justify-center text-center max-w-2xl w-full px-4">
                <header className="mb-6">
                    <h1 className="text-4xl font-bold flex items-center justify-center">
                        <span className="mr-2">🎓</span> Studium
                    </h1>
                </header>

                <p className="text-lg mb-1">{wizardMessage}</p>
                <p className="text-md font-semibold">{title}</p>

                <div className="flex gap-4 justify-center my-2">
                    <span>XP: {xp}</span>
                    <span>🔥 Streak: {streak}</span>
                </div>

                <button
                    onClick={handleCompleteQuest}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded shadow mb-8"
                >
                    Complete Quest
                </button>

                <Leaderboard />
            </div>
        </div>
    );
}

export default App;

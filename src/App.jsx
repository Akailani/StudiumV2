import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import Wizard from "./Wizard";
import "./App.css";

const quests = [
    "Complete coding challenge",
    "Read 10 pages",
    "Do 20 pushups",
    "Meditate 5 minutes"
];

function App() {
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [completedQuests, setCompletedQuests] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [message, setMessage] = useState("Welcome to Studium!");
    const [streak, setStreak] = useState(0);
    const [bossHp, setBossHp] = useState(100);
    const [showTitle, setShowTitle] = useState(false);

    useEffect(() => {
        if (xp >= level * 100) {
            setLevel((prev) => prev + 1);
            setXp(0);
            setShowTitle(true);
            setTimeout(() => setShowTitle(false), 3000);
            setMessage("You've leveled up! 🎉");
        }
    }, [xp, level]);

    const completeQuest = (quest) => {
        if (!completedQuests.includes(quest)) {
            setCompletedQuests([...completedQuests, quest]);
            setXp((prev) => prev + 20);
            setStreak((prev) => prev + 1);
            setShowConfetti(true);
            setBossHp((prev) => Math.max(prev - 10, 0));
            setMessage("Quest completed! ⚔️");
            setTimeout(() => setShowConfetti(false), 2000);
        }
    };

    return (
        <div className="App p-4 min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 text-gray-800">
            {showConfetti && <Confetti />}

            <motion.h1
                className="text-4xl font-bold text-center mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                Studium
            </motion.h1>

            {showTitle && (
                <motion.div
                    className="text-xl text-green-700 text-center mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    🎉 New Title Unlocked: Apprentice
                </motion.div>
            )}

            <div className="text-center mb-4">
                <p>XP: {xp} / {level * 100}</p>
                <p>Level: {level}</p>
                <p>Streak: 🔥 {streak}</p>
            </div>

            <div className="flex flex-col items-center mb-6">
                {quests.map((quest, index) => (
                    <motion.button
                        key={index}
                        onClick={() => completeQuest(quest)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`mb-2 px-4 py-2 rounded bg-indigo-600 text-white shadow ${completedQuests.includes(quest) ? "opacity-50" : ""}`}
                        disabled={completedQuests.includes(quest)}
                    >
                        {completedQuests.includes(quest) ? "✔️ " : ""}{quest}
                    </motion.button>
                ))}
            </div>

            <div className="text-center mb-6">
                <motion.div
                    className="w-full h-6 bg-red-300 rounded overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - bossHp}%` }}
                    transition={{ duration: 1 }}
                >
                    <div className="h-full bg-red-600" style={{ width: `${bossHp}%` }}></div>
                </motion.div>
                <p className="mt-2">Boss HP: {bossHp}%</p>
            </div>

            <Wizard message={message} />
        </div>
    );
}

export default App;

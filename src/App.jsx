import React, { useState, useEffect } from "react";
import "./index.css";
import { motion } from "framer-motion";

function getTodayDateStr() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

function getWizardMessage({ xp, streak }) {
    const messages = [
        `🔥 You've earned ${xp} XP! On fire 🔥`,
        streak > 0
            ? `🔥 You're on a ${streak}-day streak! Keep going!`
            : "Let's get that streak started!",
        "📚 Procrastinators fear you now...",
        "✨ Study magic intensifies!",
        "🧙‍♂️ Tiny tasks make mighty heroes.",
        "🆕 New quest? I like your style.",
        "💧 Don’t forget hydration and rest too, hero.",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function App() {
    const [xp, setXP] = useState(2800);
    const [quests, setQuests] = useState(() => {
        const saved = localStorage.getItem("studium-quests");
        return saved ? JSON.parse(saved) : [
            { id: 1, text: "Read Chapter 5", completed: false },
            { id: 2, text: "Review notes", completed: false },
            { id: 3, text: "Complete worksheet", completed: false }
        ];
    });

    const [streak, setStreak] = useState(() => {
        const saved = localStorage.getItem("studium-streak");
        return saved ? parseInt(saved) : 0;
    });

    const [lastActiveDate, setLastActiveDate] = useState(() =>
        localStorage.getItem("studium-lastActiveDate") || ""
    );

    const [wizardMsg, setWizardMsg] = useState("🧙‍♂️ Alan! Let's complete your study quests!");
    const [bossProgress, setBossProgress] = useState(6);
    const [newTask, setNewTask] = useState("");
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        const today = getTodayDateStr();
        if (lastActiveDate !== today) {
            if (lastActiveDate === getTodayDateStr(new Date(Date.now() - 86400000))) {
                setStreak(prev => prev + 1);
            } else {
                setStreak(0);
            }
            setLastActiveDate(today);
            localStorage.setItem("studium-lastActiveDate", today);
        }
    }, []);

    useEffect(() => {
        setWizardMsg(getWizardMessage({ xp, streak }));
        localStorage.setItem("studium-quests", JSON.stringify(quests));
        localStorage.setItem("studium-streak", streak);
    }, [xp, streak, quests]);

    const checkForNewBadges = (xp, streak, quests) => {
        const earned = [];
        if (quests.some(q => q.completed)) earned.push("✨ First Steps");
        if (xp >= 1000) earned.push("🔥 On Fire");
        if (streak >= 3) earned.push("🧊 Consistent Wizard");
        setBadges(earned);
    };

    useEffect(() => {
        checkForNewBadges(xp, streak, quests);
    }, [xp, streak, quests]);

    const handleComplete = (id) => {
        const updated = quests.map(q =>
            q.id === id ? { ...q, completed: true } : q
        );
        setQuests(updated);
        setXP(prev => prev + 100);
        setBossProgress(prev => prev + 1);
    };

    const handleAddTask = () => {
        if (!newTask.trim()) return;
        const task = {
            id: quests.length + 1,
            text: newTask,
            completed: false,
        };
        setQuests([...quests, task]);
        setNewTask("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-center mb-6"
                >
                    📘 Studium
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl text-center mb-4"
                >
                    {wizardMsg}
                </motion.p>

                <div className="space-y-2">
                    <p>⭐ <strong>XP:</strong> {xp}</p>
                    <p>🔥 <strong>Streak:</strong> {streak} days</p>
                    <p>👾 <strong>Boss HP:</strong> {bossProgress}/6</p>
                    <p>🏅 <strong>Badges:</strong> {badges.join(", ")}</p>
                </div>

                <div className="flex items-center mt-4 gap-2">
                    <input
                        className="border rounded px-2 py-1 flex-grow"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="New quest..."
                    />
                    <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={handleAddTask}
                    >
                        Add
                    </button>
                </div>

                <ul className="mt-4 space-y-1">
                    {quests.map(q => (
                        <li key={q.id} className="flex items-center justify-between">
                            <span className={q.completed ? "line-through text-gray-500" : "font-bold"}>{q.text}</span>
                            {!q.completed && (
                                <button
                                    className="text-sm text-green-500 hover:underline"
                                    onClick={() => handleComplete(q.id)}
                                >
                                    Complete
                                </button>
                            )}
                        </li>
                    ))}
                </ul>

                {bossProgress >= 6 && (
                    <p className="mt-4 text-pink-500 text-center text-lg">🎉 You defeated the boss!</p>
                )}
            </div>
        </div>
    );
}

export default App;

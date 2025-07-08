import React, { useState, useEffect } from "react";
import "./App.css";
import { motion, AnimatePresence } from "framer-motion";

function App() {
    const [quests, setQuests] = useState(() => {
        const stored = localStorage.getItem("quests");
        return stored ? JSON.parse(stored) : [];
    });
    const [input, setInput] = useState("");
    const [xp, setXP] = useState(() => Number(localStorage.getItem("xp")) || 0);
    const [streak, setStreak] = useState(() => Number(localStorage.getItem("streak")) || 0);
    const [lastCompletedDate, setLastCompletedDate] = useState(() =>
        localStorage.getItem("lastCompletedDate")
    );
    const [bossHP, setBossHP] = useState(() => Number(localStorage.getItem("bossHP")) || 6);
    const [badges, setBadges] = useState(() => {
        const stored = localStorage.getItem("badges");
        return stored ? JSON.parse(stored) : [];
    });

    const titles = [
        { xp: 0, title: "Novice" },
        { xp: 1000, title: "Apprentice" },
        { xp: 3000, title: "Journeyman" },
        { xp: 5000, title: "Wizard" },
        { xp: 8000, title: "Archmage" },
        { xp: 12000, title: "Legend" },
    ];

    const currentTitle = titles.reduce((acc, t) => (xp >= t.xp ? t.title : acc), "Novice");

    useEffect(() => {
        localStorage.setItem("quests", JSON.stringify(quests));
        localStorage.setItem("xp", xp);
        localStorage.setItem("streak", streak);
        localStorage.setItem("lastCompletedDate", lastCompletedDate);
        localStorage.setItem("bossHP", bossHP);
        localStorage.setItem("badges", JSON.stringify(badges));
    }, [quests, xp, streak, lastCompletedDate, bossHP, badges]);

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        if (lastCompletedDate && lastCompletedDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yString = yesterday.toISOString().split("T")[0];
            if (lastCompletedDate !== yString) {
                setStreak(0);
            }
        }
    }, []);

    const handleAddQuest = () => {
        if (input.trim() === "") return;
        setQuests([...quests, { text: input, completed: false }]);
        setInput("");
    };

    const handleComplete = (index) => {
        const updated = [...quests];
        if (!updated[index].completed) {
            updated[index].completed = true;
            setXP(xp + 100);
            setBossHP((prev) => (prev > 0 ? prev - 1 : 0));

            const today = new Date().toISOString().split("T")[0];
            if (lastCompletedDate !== today) {
                setStreak(streak + 1);
                setLastCompletedDate(today);
            }

            const newBadges = [...badges];
            if (xp + 100 >= 100 && !badges.includes("✨ First Steps")) {
                newBadges.push("✨ First Steps");
            }
            if (streak + 1 >= 7 && !badges.includes("🔥 On Fire")) {
                newBadges.push("🔥 On Fire");
            }
            setBadges(newBadges);
        }
        setQuests(updated);
    };

    return (
        <div className="app-container">
            <h1>📘 Studium</h1>

            {bossHP <= 0 && <p>🎉 You defeated the boss!</p>}

            <p>🆕 New quest? I like your style.</p>
            <p>🧙‍♂️ <strong>Title:</strong> {currentTitle}</p>
            <p>⭐ <strong>XP:</strong> {xp}</p>
            <p>🔥 <strong>Streak:</strong> {streak} days</p>
            <p className="boss-hp">👾 <strong>Boss HP:</strong> {bossHP}/6</p>
            <p>🏅 <strong>Badges:</strong> {badges.join(", ") || "None yet"}</p>

            <div>
                <input
                    type="text"
                    value={input}
                    placeholder="New quest..."
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={handleAddQuest}>Add</button>
            </div>

            <ul>
                <AnimatePresence>
                    {quests.map((quest, index) => (
                        <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            style={{ fontWeight: quest.completed ? "normal" : "bold" }}
                        >
                            {quest.text}
                            {!quest.completed && (
                                <button onClick={() => handleComplete(index)}>Complete</button>
                            )}
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>

            <h2>🏆 Leaderboard</h2>
            <ol>
                <li><strong>You:</strong> {xp} XP</li>
            </ol>
        </div>
    );
}

export default App;

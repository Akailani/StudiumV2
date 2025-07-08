import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

const App = () => {
    const [questsCompleted, setQuestsCompleted] = useState(0);
    const [streak, setStreak] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [bossHP, setBossHP] = useState(100);
    const [title, setTitle] = useState("Novice");
    const [message, setMessage] = useState("Welcome, young adventurer!");
    const [leaderboard, setLeaderboard] = useState([
        { name: "You", xp: 0 },
        { name: "Rival1", xp: 100 },
        { name: "Rival2", xp: 200 },
    ]);

    useEffect(() => {
        const titles = [
            "Novice",
            "Apprentice",
            "Scholar",
            "Sage",
            "Mastermind",
            "Legend",
        ];
        const newTitle = titles[Math.min(Math.floor(questsCompleted / 3), titles.length - 1)];
        setTitle(newTitle);
    }, [questsCompleted]);

    const handleCompleteQuest = () => {
        const newXP = (questsCompleted + 1) * 50;
        setQuestsCompleted((prev) => prev + 1);
        setStreak((prev) => prev + 1);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);

        const damage = Math.floor(Math.random() * 20) + 10;
        setBossHP((prev) => Math.max(0, prev - damage));
        setMessage("The wizard cheers! +" + damage + " damage to the boss!");

        setLeaderboard((prev) => {
            const updated = prev.map((user) =>
                user.name === "You" ? { ...user, xp: newXP } : user
            );
            return updated.sort((a, b) => b.xp - a.xp);
        });
    };

    return (
        <div className="App">
            {showConfetti && <Confetti />}

            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Studium: Quest to Learn
            </motion.h1>

            <p>🧙‍♂️ <i>{message}</i></p>
            <p>🎖️ Title: {title}</p>
            <p>🔥 Streak: {streak}</p>
            <p>✅ Quests Completed: {questsCompleted}</p>

            <button onClick={handleCompleteQuest}>Complete Quest</button>

            <div className="boss-battle">
                <motion.div
                    className="boss-hp-bar"
                    initial={{ width: "100%" }}
                    animate={{ width: `${bossHP}%` }}
                    transition={{ duration: 0.5 }}
                />
                <p>🧟 Boss HP: {bossHP}/100</p>
            </div>

            <div className="leaderboard">
                <h2>🏆 Leaderboard</h2>
                <ul>
                    {leaderboard.map((user, i) => (
                        <li key={i}>
                            {i + 1}. {user.name} — {user.xp} XP
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default App;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const titles = [
    { title: 'Apprentice', minXP: 0 },
    { title: 'Spellcaster', minXP: 3000 },
    { title: 'Archmage', minXP: 5000 },
    { title: 'Studium Grandmaster', minXP: 8000 }
];

function getTitle(xp) {
    return titles.reduce((acc, cur) => (xp >= cur.minXP ? cur.title : acc), titles[0].title);
}

function App() {
    const [quests, setQuests] = useState([]);
    const [input, setInput] = useState('');
    const [xp, setXP] = useState(0);
    const [streak, setStreak] = useState(0);
    const [bossHP, setBossHP] = useState(0);
    const [badges, setBadges] = useState([]);
    const [messages, setMessages] = useState(['📘 Studium']);
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('studium-data');
        if (stored) {
            const { quests, xp, streak, bossHP, badges, leaderboard } = JSON.parse(stored);
            setQuests(quests);
            setXP(xp);
            setStreak(streak);
            setBossHP(bossHP);
            setBadges(badges);
            setLeaderboard(leaderboard || []);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            'studium-data',
            JSON.stringify({ quests, xp, streak, bossHP, badges, leaderboard })
        );
    }, [quests, xp, streak, bossHP, badges, leaderboard]);

    const handleAddQuest = () => {
        if (input.trim()) {
            const newQuest = { text: input.trim(), done: false };
            setQuests([...quests, newQuest]);
            setInput('');
            setMessages(["🆕 New quest? I like your style."]);
        }
    };

    const handleComplete = (index) => {
        const updated = [...quests];
        if (!updated[index].done) {
            updated[index].done = true;
            const newXP = xp + 200;
            const newBossHP = bossHP + 1;
            const newBadges = [...badges];

            if (newXP >= 3000 && !newBadges.includes('🔥 On Fire')) newBadges.push('🔥 On Fire');
            if (newXP >= 100 && !newBadges.includes('✨ First Steps')) newBadges.push('✨ First Steps');
            if (streak >= 5 && !newBadges.includes('🧙‍♂️ Consistent Wizard')) newBadges.push('🧙‍♂️ Consistent Wizard');

            setXP(newXP);
            setBossHP(newBossHP);
            setBadges(newBadges);
            setMessages([`✅ Quest complete! You earned 200 XP.`]);

            if (newBossHP >= 6) {
                setMessages(["🎉 You defeated the boss!"]);
            }
        }
        setQuests(updated);
    };

    const title = getTitle(xp);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
                <motion.h1
                    className="text-3xl font-bold text-center mb-4"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}>
                    📘 Studium
                </motion.h1>

                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.p
                            key={i}
                            className="text-center mb-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}>
                            {msg}
                        </motion.p>
                    ))}
                </AnimatePresence>

                <div className="space-y-1">
                    <p><strong>🧙‍♂️ Title:</strong> {title}</p>
                    <p><strong>⭐ XP:</strong> {xp}</p>
                    <p><strong>🔥 Streak:</strong> {streak} days</p>
                    <motion.p
                        animate={{ scale: bossHP >= 6 ? 1.2 : 1 }}
                        transition={{ duration: 0.2 }}>
                        <strong>👾 Boss HP:</strong> {bossHP}/6
                    </motion.p>
                    <p><strong>🏅 Badges:</strong> {badges.join(', ') || 'None yet'}</p>
                </div>

                <div className="mt-4 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="New quest..."
                        className="border rounded px-2 py-1 flex-1"
                    />
                    <button onClick={handleAddQuest} className="bg-blue-500 text-white px-3 py-1 rounded">Add</button>
                </div>

                <ul className="mt-4 space-y-1">
                    {quests.map((quest, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                            <span className={quest.done ? 'line-through text-gray-400' : 'font-bold'}>• {quest.text}</span>
                            {!quest.done && (
                                <button onClick={() => handleComplete(idx)} className="ml-auto bg-gray-200 text-xs px-2 py-1 rounded">Complete</button>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="mt-6">
                    <h2 className="font-bold mb-2">🏆 Leaderboard</h2>
                    <ul className="text-sm">
                        {[...leaderboard, { name: 'You', xp }]
                            .sort((a, b) => b.xp - a.xp)
                            .map((entry, i) => (
                                <li key={i}>{i + 1}. {entry.name}: {entry.xp} XP</li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;

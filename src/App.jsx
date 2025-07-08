// App.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
    const [quests, setQuests] = useState(() => {
        const saved = localStorage.getItem('quests');
        return saved ? JSON.parse(saved) : [];
    });
    const [input, setInput] = useState('');
    const [xp, setXP] = useState(() => parseInt(localStorage.getItem('xp')) || 0);
    const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('streak')) || 0);
    const [badges, setBadges] = useState(() => JSON.parse(localStorage.getItem('badges')) || ['✨ First Steps']);
    const [title, setTitle] = useState(() => localStorage.getItem('title') || 'Apprentice');
    const [bossHP, setBossHP] = useState(() => parseInt(localStorage.getItem('bossHP')) || 6);
    const [showVictory, setShowVictory] = useState(false);

    useEffect(() => {
        localStorage.setItem('quests', JSON.stringify(quests));
        localStorage.setItem('xp', xp);
        localStorage.setItem('streak', streak);
        localStorage.setItem('badges', JSON.stringify(badges));
        localStorage.setItem('title', title);
        localStorage.setItem('bossHP', bossHP);
    }, [quests, xp, streak, badges, title, bossHP]);

    useEffect(() => {
        if (xp >= 4000 && !badges.includes('🔥 On Fire')) {
            setBadges(prev => [...prev, '🔥 On Fire']);
        }
        if (streak >= 7 && !badges.includes('🧙‍♂️ Consistent Wizard')) {
            setBadges(prev => [...prev, '🧙‍♂️ Consistent Wizard']);
        }
        if (xp >= 5000) setTitle('Elite Wizard');
        else if (xp >= 3000) setTitle('Master');
        else if (xp >= 2000) setTitle('Journeyman');
        else setTitle('Apprentice');
    }, [xp, streak]);

    const addQuest = () => {
        if (!input.trim()) return;
        const newQuest = { text: input, complete: false };
        setQuests([...quests, newQuest]);
        setInput('');
        setXP(prev => prev + 100);
        setBossHP(prev => {
            const newHP = prev - 1;
            if (newHP <= 0) {
                setShowVictory(true);
                setTimeout(() => setShowVictory(false), 3000);
                return 6;
            }
            return newHP;
        });
    };

    const completeQuest = (index) => {
        const updated = [...quests];
        updated[index].complete = true;
        setQuests(updated);
        setXP(prev => prev + 200);
    };

    return (
        <div className="App">
            <h1>📘 Studium</h1>
            <p>🆕 New quest? I like your style.</p>
            <p>🧙‍♂️ <strong>Title:</strong> {title}</p>
            <p>⭐ <strong>XP:</strong> {xp}</p>
            <p>🔥 <strong>Streak:</strong> {streak} days</p>
            <p>👾 <strong>Boss HP:</strong> {bossHP}/6</p>
            <p>🥇 <strong>Badges:</strong> {badges.join(', ')}</p>

            <input
                placeholder="New quest..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={addQuest}>Add</button>

            <ul>
                {quests.map((q, i) => (
                    <li key={i} style={{ fontWeight: q.complete ? 'normal' : 'bold' }}>
                        {q.text}
                        {!q.complete && <button onClick={() => completeQuest(i)}>Complete</button>}
                    </li>
                ))}
            </ul>

            <h2>🏆 Leaderboard</h2>
            <ol>
                <li>You: {xp} XP</li>
            </ol>

            <AnimatePresence>
                {showVictory && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.8 }}
                        className="victory-animation"
                    >
                        🎉 You defeated the boss!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;


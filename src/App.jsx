import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import './App.css';
import { db } from './firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";

const titles = [
    { title: 'Novice', minXP: 0 },
    { title: 'Apprentice', minXP: 1000 },
    { title: 'Adept', minXP: 3000 },
    { title: 'Scholar', minXP: 5000 },
    { title: 'Mastermind', minXP: 8000 },
];

function App() {
    const [quests, setQuests] = useState([]);
    const [newQuest, setNewQuest] = useState('');
    const [xp, setXP] = useState(0);
    const [streak, setStreak] = useState(0);
    const [bossHP, setBossHP] = useState(10);
    const [badges, setBadges] = useState(['✨ First Steps']);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const loadXP = async () => {
            try {
                const docRef = doc(db, "users", "defaultUser");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setXP(docSnap.data().xp);
                }
            } catch (e) {
                console.error("Error loading XP:", e);
            }
        };

        loadXP();
    }, []);

    useEffect(() => {
        const saveXP = async () => {
            try {
                await setDoc(doc(db, "users", "defaultUser"), {
                    xp: xp
                });
            } catch (e) {
                console.error("Error saving XP:", e);
            }
        };

        saveXP();
    }, [xp]);

    const handleAddQuest = () => {
        if (newQuest.trim()) {
            setQuests([...quests, { text: newQuest, completed: false }]);
            setNewQuest('');
        }
    };

    const handleCompleteQuest = (index) => {
        const updatedQuests = [...quests];
        updatedQuests[index].completed = true;
        setQuests(updatedQuests);

        const newXP = xp + 500;
        setXP(newXP);
        setBossHP(prev => prev - 2);
        setStreak(prev => prev + 1);

        if (newXP >= 1000 && !badges.includes('🔥 On Fire')) {
            setBadges([...badges, '🔥 On Fire']);
        }

        if (bossHP - 2 <= 0) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
            setBossHP(10 + Math.floor(newXP / 1000));
        }
    };

    const currentTitle = titles.reduce((acc, t) => (xp >= t.minXP ? t.title : acc), 'Novice');

    return (
        <div className="App">
            {showConfetti && <Confetti />}

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                📘 Studium
            </motion.h1>

            <p>🆕 New quest? I like your style.</p>
            <p>🧙‍♂️ <strong>Title:</strong> {currentTitle}</p>
            <p>⭐ <strong>XP:</strong> {xp}</p>
            <p>🔥 <strong>Streak:</strong> {streak} days</p>
            <p>🐉 <strong>Boss HP:</strong> {bossHP}</p>
            <p>🏅 <strong>Badges:</strong> {badges.join(', ')}</p>

            <input
                type="text"
                value={newQuest}
                placeholder="New quest..."
                onChange={(e) => setNewQuest(e.target.value)}
            />
            <button onClick={handleAddQuest}>Add</button>

            <ul>
                {quests.map((quest, index) => (
                    <li key={index}>
                        <strong>{quest.text}</strong>
                        {!quest.completed && (
                            <button onClick={() => handleCompleteQuest(index)}>Complete</button>
                        )}
                    </li>
                ))}
            </ul>

            {bossHP <= 0 && <p>🎉 You defeated the boss!</p>}

            <h2>🏆 Leaderboard</h2>
            <ul>
                <li>1. You: {xp} XP</li>
            </ul>
        </div>
    );
}

export default App;

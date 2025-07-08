import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Leaderboard from './Leaderboard';

function App() {
    const [xp, setXP] = useState(0);
    const [streak, setStreak] = useState(0);
    const [title, setTitle] = useState('Adventurer');
    const [wizardMessage, setWizardMessage] = useState('🧙‍♂️ "Loading wisdom..."');

    const userId = 'demoUser';

    const titles = [
        { level: 0, name: 'Apprentice' },
        { level: 100, name: 'Scholar' },
        { level: 300, name: 'Wizard' },
        { level: 600, name: 'Sage' },
        { level: 1000, name: 'Archmage' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                setXP(data.xp || 0);
                setStreak(data.streak || 0);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const currentTitle = titles
            .slice()
            .reverse()
            .find((t) => xp >= t.level);

        if (currentTitle) {
            setTitle(currentTitle.name);
        }
    }, [xp]);

    const completeQuest = async () => {
        const xpGain = 50;
        const newXP = xp + xpGain;
        const newStreak = streak + 1;

        setXP(newXP);
        setStreak(newStreak);

        const newTitle = titles
            .slice()
            .reverse()
            .find((t) => newXP >= t.level)?.name || title;

        setTitle(newTitle);
        setWizardMessage(`🧙‍♂️ "You gained ${xpGain} XP! Now you're a ${newTitle}!"`);

        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            xp: newXP,
            streak: newStreak,
            title: newTitle,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
            <div className="max-w-3xl mx-auto">
                <motion.h1
                    className="text-5xl font-bold text-center mb-8 flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    🎓 Studium
                </motion.h1>

                <motion.div
                    className="bg-white p-6 rounded-xl shadow-xl mb-6"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <p className="text-lg mb-2">{wizardMessage}</p>
                    <p className="font-semibold">Wizard</p>
                    <p className="mt-2">
                        XP: {xp} | 🔥 Streak: {streak}
                    </p>
                    <button
                        onClick={completeQuest}
                        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                    >
                        Complete Quest
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    <Leaderboard />
                </motion.div>
            </div>
        </div>
    );
}

export default App;

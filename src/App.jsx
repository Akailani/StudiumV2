import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Leaderboard from './Leaderboard.js';



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
        { level: 1000, name: 'Archmage' }
    ];

    const getTitleFromXP = (xp) => {
        return [...titles].reverse().find(t => xp >= t.level)?.name || 'Adventurer';
    };

    const fetchData = async () => {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            setXP(userData.xp || 0);
            setStreak(userData.streak || 0);
            setTitle(getTitleFromXP(userData.xp || 0));
            setWizardMessage(`🧙‍♂️ "Ah, a ${getTitleFromXP(userData.xp)}! Keep going!"`);
        } else {
            await setDoc(userRef, { xp: 0, streak: 0 });
            setXP(0);
            setStreak(0);
            setTitle('Adventurer');
            setWizardMessage('🧙‍♂️ "Welcome, Adventurer! Let us begin your quest."');
        }
    };

    const completeQuest = async () => {
        const newXP = xp + 50;
        const newStreak = streak + 1;
        const newTitle = getTitleFromXP(newXP);

        setXP(newXP);
        setStreak(newStreak);
        setTitle(newTitle);
        setWizardMessage(`🧙‍♂️ "You gained 50 XP! Now you're a ${newTitle}!"`);

        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, { xp: newXP, streak: newStreak }, { merge: true });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <motion.div
                className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-4xl font-bold mb-4">🎓 Studium</h1>
                <p className="text-lg mb-2">{wizardMessage}</p>
                <p className="text-xl font-semibold mb-2">{title}</p>
                <p className="text-md text-gray-700 mb-4">
                    XP: {xp} | 🔥 Streak: {streak}
                </p>
                <button
                    onClick={completeQuest}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition duration-300"
                >
                    Complete Quest
                </button>
            </motion.div>

            <div className="mt-12 w-full max-w-md">
                <Leaderboard />
            </div>
        </div>
    );
}

export default App;

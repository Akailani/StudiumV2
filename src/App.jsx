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
    const [wizardMessage, setWizardMessage] = useState('🧙‍♂️ "Welcome, brave soul."');

    const userId = 'demoUser';

    const titles = [
        { level: 0, name: 'Apprentice' },
        { level: 100, name: 'Scholar' },
        { level: 300, name: 'Wizard' },
        { level: 600, name: 'Sage' },
        { level: 1000, name: 'Archmage' },
    ];

    const completeQuest = async () => {
        const newXP = xp + 50;
        const newStreak = streak + 1;

        setXP(newXP);
        setStreak(newStreak);

        const newTitle =
            titles
                .slice()
                .reverse()
                .find(t => newXP >= t.level)?.name || 'Adventurer';

        setTitle(newTitle);
        setWizardMessage(`🧙‍♂️ "You gained 50 XP! Now you're a ${newTitle}!"`);

        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, { xp: newXP, streak: newStreak }, { merge: true });
    };

    useEffect(() => {
        const fetchData = async () => {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                setXP(data.xp || 0);
                setStreak(data.streak || 0);

                const currentTitle =
                    titles
                        .slice()
                        .reverse()
                        .find(t => data.xp >= t.level)?.name || 'Adventurer';
                setTitle(currentTitle);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-10 px-4 text-center">
            <h1 className="text-5xl font-bold mb-10 flex items-center gap-2">
                🎓 Studium
            </h1>

            <div className="w-full max-w-md flex flex-col items-center gap-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg"
                >
                    <p>{wizardMessage}</p>
                    <p className="text-xl font-semibold mt-2">{title}</p>
                    <p>
                        XP: {xp} | 🔥 Streak: {streak}
                    </p>
                </motion.div>

                <button
                    onClick={completeQuest}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                    Complete Quest
                </button>

                <Leaderboard />
            </div>
        </div>
    );
}

export default App;


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

    const completeQuest = async () => {
        const newXP = xp + 50;
        const newStreak = streak + 1;
        setXP(newXP);
        setStreak(newStreak);

        const newTitle = titles.slice().reverse().find(t => newXP >= t.level)?.name || 'Adventurer';
        if (newTitle !== title) {
            setTitle(newTitle);
            setWizardMessage(`🧙‍♂️ "You gained 50 XP! Now you're a ${newTitle}!"`);
        } else {
            setWizardMessage(`🧙‍♂️ "+50 XP gained! Keep it up, ${title}!"`);
        }

        await setDoc(doc(db, 'users', userId), {
            xp: newXP,
            streak: newStreak,
            title: newTitle,
        });
    };

    useEffect(() => {
        const fetchUser = async () => {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                setXP(userData.xp || 0);
                setStreak(userData.streak || 0);
                setTitle(userData.title || 'Adventurer');
            }
        };
        fetchUser();
    }, []);

    const currentTitle = titles.find(t => t.name === title);
    const nextTitle = titles.find(t => t.level > (currentTitle?.level || 0));
    const progressPercent = nextTitle
        ? ((xp - currentTitle.level) / (nextTitle.level - currentTitle.level)) * 100
        : 100;

    return (
        <div className="App bg-gray-100 min-h-screen p-8">
            <h1 className="text-4xl font-bold text-center mb-6">🎓 Studium</h1>
            <div className="bg-white p-4 rounded-xl shadow-xl max-w-md mx-auto mb-4">
                <p className="text-lg mb-2">{wizardMessage}</p>
                <p className="text-sm text-gray-600 mb-2">{title}</p>
                <p className="mb-2">XP: {xp} | 🔥 Streak: {streak}</p>

                <div className="w-full h-4 bg-gray-300 rounded overflow-hidden mb-3">
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={completeQuest}>
                    Complete Quest
                </button>
            </div>

            <Leaderboard />
        </div>
    );
}

export default App;

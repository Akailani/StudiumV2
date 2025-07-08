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
        const currentTitle = titles.reduce((acc, t) => (xp >= t.level ? t.name : acc), 'Adventurer');
        setTitle(currentTitle);
    }, [xp]);

    const handleCompleteQuest = async () => {
        const newXP = xp + 50;
        const newStreak = streak + 1;

        setXP(newXP);
        setStreak(newStreak);

        const newTitle = titles.reduce((acc, t) => (newXP >= t.level ? t.name : acc), 'Adventurer');
        setTitle(newTitle);
        setWizardMessage(`🧙‍♂️ "You gained 50 XP! Now you're a ${newTitle}!"`);

        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, { xp: newXP, streak: newStreak }, { merge: true });
    };

    return (
        <div className="container">
            <h1 className="text-4xl font-bold text-center mb-6">🎓 Studium</h1>

            <p>{wizardMessage}</p>
            <p>{title}</p>
            <p>XP: {xp} | 🔥 Streak: {streak}</p>

            <button onClick={handleCompleteQuest}>Complete Quest</button>

            <Leaderboard />
        </div>
    );
}

export default App;

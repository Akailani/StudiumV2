import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import './App.css';

const App = () => {
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState(0);
    const [title, setTitle] = useState('Novice Scholar');
    const [wizardMessage, setWizardMessage] = useState('Welcome, young scholar!');
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, 'users', 'defaultUser');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setXp(data.xp || 0);
                setStreak(data.streak || 0);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const updateTitle = () => {
            if (xp >= 1000) setTitle('Grandmaster Sage');
            else if (xp >= 500) setTitle('Master Wizard');
            else if (xp >= 250) setTitle('Adept Mage');
            else if (xp >= 100) setTitle('Apprentice');
            else setTitle('Novice Scholar');
        };
        updateTitle();
    }, [xp]);

    const completeQuest = async () => {
        const newXp = xp + 50;
        const newStreak = streak + 1;
        setXp(newXp);
        setStreak(newStreak);
        setWizardMessage(`You gained 50 XP! Keep it up!`);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        await setDoc(doc(db, 'users', 'defaultUser'), { xp: newXp, streak: newStreak });
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-purple-900 to-black text-white">
            <div className="max-w-sm mx-auto px-4 py-6 flex flex-col items-center">
                {showConfetti && <Confetti />}

                <motion.img
                    src="/wizard.png"
                    alt="Wizard"
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-32 h-32 mb-4"
                />

                <motion.div
                    className="bg-purple-800 p-4 rounded-xl shadow-xl text-center mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <p className="text-lg italic">{wizardMessage}</p>
                </motion.div>

                <div className="bg-purple-700 p-4 rounded-xl shadow-lg w-full text-center mb-4">
                    <p className="text-xl font-bold">Title: {title}</p>
                    <p className="text-md">XP: {xp}</p>
                    <p className="text-md">🔥 Streak: {streak} days</p>
                </div>

                <button
                    onClick={completeQuest}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl shadow"
                >
                    Complete Quest
                </button>
            </div>
        </div>
    );
};

export default App;

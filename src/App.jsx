import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import Confetti from 'react-confetti';
import Wizard from './components/Wizard';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const App = () => {
    const [exp, setExp] = useState(0);
    const [streak, setStreak] = useState(1);
    const [title, setTitle] = useState("Novice Scholar");
    const [showConfetti, setShowConfetti] = useState(false);
    const [message, setMessage] = useState("Loading wisdom...");

    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, "users", "user1");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setExp(data.exp || 0);
                setStreak(data.streak || 1);
                updateTitle(data.exp || 0);
            } else {
                await setDoc(docRef, { exp: 0, streak: 1 });
            }
            setMessage("Ah, welcome back young scholar!");
        };
        fetchData();
    }, []);

    const updateTitle = (newExp) => {
        if (newExp >= 200) setTitle("Grandmaster of Academia");
        else if (newExp >= 100) setTitle("Academic Hero");
        else if (newExp >= 50) setTitle("Study Warrior");
        else setTitle("Novice Scholar");
    };

    const completeQuest = async () => {
        const newExp = exp + 10;
        const newStreak = streak + 1;
        setExp(newExp);
        setStreak(newStreak);
        updateTitle(newExp);
        setShowConfetti(true);
        setMessage("A quest well completed!");
        setTimeout(() => setShowConfetti(false), 3000);
        const docRef = doc(db, "users", "user1");
        await setDoc(docRef, { exp: newExp, streak: newStreak });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-200 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-center">
                {showConfetti && <Confetti />}

                <Wizard message={message} />

                <h1 className="text-3xl font-bold text-purple-800 mt-4">🎓 {title}</h1>

                <div className="mt-4 text-lg">
                    <p className="mb-2">XP: <span className="font-semibold">{exp}</span></p>
                    <p>🔥 Streak: <span className="font-semibold">{streak} days</span></p>
                </div>

                <button
                    onClick={completeQuest}
                    className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl shadow"
                >
                    ✅ Complete Quest
                </button>
            </div>
        </div>
    );
};

export default App;

// src/App.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import { db, app, analytics } from './firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";

function App() {
    const [xp, setXP] = useState(0);
    const [streak, setStreak] = useState(0);
    const [title, setTitle] = useState('Wizard');
    const [wizardMessage, setWizardMessage] = useState("🧙‍♂️ \"Loading wisdom...\"");

    // Load XP and streak from Firestore
    useEffect(() => {
        const fetchData = async () => {
            const userRef = doc(db, "users", "defaultUser");
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setXP(data.xp || 0);
                setStreak(data.streak || 0);
            }
        };
        fetchData();
    }, []);

    // Update wizard message when XP/streak changes
    useEffect(() => {
        if (xp === 0) {
            setWizardMessage("🧙‍♂️ \"Let the journey begin!\"");
        } else if (xp < 100) {
            setWizardMessage("🧙‍♂️ \"You're learning quickly!\"");
        } else if (xp < 500) {
            setWizardMessage("🧙‍♂️ \"The arcane arts suit you well.\"");
        } else if (xp < 1000) {
            setWizardMessage("🧙‍♂️ \"You're mastering the mystic scrolls!\"");
        } else {
            setWizardMessage("🧙‍♂️ \"Your wisdom rivals the ancients!\"");
        }
    }, [xp, streak]);

    const handleCompleteQuest = async () => {
        const newXP = xp + 10;
        const newStreak = streak + 1;
        setXP(newXP);
        setStreak(newStreak);

        const userRef = doc(db, "users", "defaultUser");
        await setDoc(userRef, { xp: newXP, streak: newStreak });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <motion.div
                className="bg-white p-6 rounded-2xl shadow-xl text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl font-bold mb-2">🎓 Studium</h1>
                <p className="text-lg mb-2">{wizardMessage}</p>
                <p className="mb-2">{title}</p>
                <p className="mb-4">XP: {xp} | 🔥 Streak: {streak}</p>
                <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
                    onClick={handleCompleteQuest}
                >
                    Complete Quest
                </button>
            </motion.div>
        </div>
    );
}

export default App;

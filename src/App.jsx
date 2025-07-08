import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import Confetti from 'react-confetti';
import Wizard from './components/WizardComponent';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const App = () => {
    const [exp, setExp] = useState(0);
    const [streak, setStreak] = useState(1);
    const [title, setTitle] = useState("Novice Scholar");
    const [showConfetti, setShowConfetti] = useState(false);
    const [message, setMessage] = useState("Loading wisdom...");
    const [avatarUrl, setAvatarUrl] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, "users", "user1");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setExp(data.exp || 0);
                setStreak(data.streak || 1);
                setAvatarUrl(data.avatarUrl || null);
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
        await setDoc(docRef, { exp: newExp, streak: newStreak, avatarUrl });
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
            const imageDataUrl = reader.result;
            setAvatarUrl(imageDataUrl);
            const docRef = doc(db, "users", "user1");
            await setDoc(docRef, { exp, streak, avatarUrl: imageDataUrl });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card">
                {showConfetti && <Confetti />}

                {avatarUrl ? (
                    <img src={avatarUrl} alt="User Avatar" className="avatar" />
                ) : (
                    <div className="avatar bg-gray-500 flex items-center justify-center text-white text-lg">
                        No Avatar
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="mb-4 text-sm text-gray-300"
                />

                <Wizard message={message} />

                <h1 className="title">🎓 {title}</h1>

                <div className="mt-4 stats">
                    <p className="mb-2">XP: <span className="font-semibold">{exp}</span></p>
                    <p>🔥 Streak: <span className="font-semibold">{streak} days</span></p>
                </div>

                <button
                    onClick={completeQuest}
                    className="mt-6 button"
                >
                    ✅ Complete Quest
                </button>
            </div>
        </div>
    );
};

export default App;

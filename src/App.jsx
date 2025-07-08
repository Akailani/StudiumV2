import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import './App.css';
import Wizard from './components/WizardComponent';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const App = () => {
    const [exp, setExp] = useState(0);
    const [streak, setStreak] = useState(1);
    const [title, setTitle] = useState("Novice Scholar");
    const [showConfetti, setShowConfetti] = useState(false);
    const [message, setMessage] = useState("Loading wisdom...");
    const [avatarURL, setAvatarURL] = useState(null);

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

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarURL(URL.createObjectURL(file));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F3E7FF] via-[#D3D3FC] to-[#B1E3FF] p-4">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 text-center border border-purple-200">
                {showConfetti && <Confetti />}

                <div className="relative mb-4">
                    {avatarURL ? (
                        <img
                            src={avatarURL}
                            alt="User Avatar"
                            className="w-24 h-24 object-cover rounded-full mx-auto border-4 border-purple-400 shadow-md"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-sm text-gray-500 shadow-inner">
                            No Avatar
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="block mx-auto mt-2 text-sm text-purple-800"
                    />
                </div>

                <Wizard message={message} />

                <h1 className="text-3xl font-bold text-purple-700 mt-4">🎓 {title}</h1>

                <div className="mt-4 text-lg text-gray-700">
                    <p className="mb-2">XP: <span className="font-semibold">{exp}</span></p>
                    <p>🔥 Streak: <span className="font-semibold">{streak} days</span></p>
                </div>

                <button
                    onClick={completeQuest}
                    className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition-all"
                >
                    ✅ Complete Quest
                </button>
            </div>
        </div>
    );
};

export default App;

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
    const [uploadedImage, setUploadedImage] = useState(null);

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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-white">
            <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-6 text-center border border-purple-700">
                {showConfetti && <Confetti />}

                {/* Avatar Display Container */}
                <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden bg-white shadow-md">
                    <img
                        src={uploadedImage || "/assets/avatars/avatar1.png"}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Image Upload Input */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mb-4 text-sm text-white"
                />

                {/* Wizard Assistant */}
                <Wizard message={message} />

                {/* Title */}
                <h1 className="text-3xl font-bold text-purple-400 mt-4">🎓 {title}</h1>

                {/* XP and Streak */}
                <div className="mt-4 text-lg">
                    <p className="mb-2">XP: <span className="font-semibold">{exp}</span></p>
                    <p>🔥 Streak: <span className="font-semibold">{streak} days</span></p>
                </div>

                {/* Complete Quest Button */}
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

import React, { useState, useEffect } from 'react';
import './App.css';
import Confetti from 'react-confetti';
import Wizard from './components/WizardComponent'; // Make sure this path matches your actual filename
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
        <div className="container">
            {showConfetti && <Confetti />}
            <Wizard message={message} />
            <h1 className="title">🎓 {title}</h1>
            <div className="stats">
                <p>XP: <strong>{exp}</strong></p>
                <p>🔥 Streak: <strong>{streak} days</strong></p>
            </div>
            <button onClick={completeQuest} className="quest-button">
                ✅ Complete Quest
            </button>
        </div>
    );
};

export default App;

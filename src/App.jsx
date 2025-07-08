import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import { db } from './firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";
import Wizard from './Wizard';

export default function App() {
    const [xp, setXP] = useState(0);
    const [streak, setStreak] = useState(1);
    const [showConfetti, setShowConfetti] = useState(false);
    const [quote, setQuote] = useState("Loading wisdom...");

    useEffect(() => {
        fetch('https://type.fit/api/quotes')
            .then(res => res.json())
            .then(data => {
                const random = Math.floor(Math.random() * data.length);
                setQuote(data[random].text);
            });
    }, []);

    const completeQuest = async () => {
        const newXP = xp + 10;
        setXP(newXP);
        setStreak(streak + 1);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);

        const docRef = doc(db, "users", "demoUser");
        await setDoc(docRef, { xp: newXP, streak: streak + 1 });
    };

    return (
        <div className="app">
            <div className="background" />
            <motion.div className="glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                <h1>🎓 Studium</h1>
                <p className="quote">🧙‍♂️ "{quote}"</p>
                <Wizard />
                <p>XP: {xp} | 🔥 Streak: {streak}</p>
                <button className="quest-button" onClick={completeQuest}>Complete Quest</button>
            </motion.div>
        </div>
    );
}

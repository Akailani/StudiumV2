import React, { useEffect, useState } from 'react';
import Wizard from './components/WizardComponent';
import { db } from './firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const App = () => {
    const [message, setMessage] = useState("🧙 Loading wisdom...");
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState(1);
    const [title, setTitle] = useState("🎓 Novice Scholar");

    useEffect(() => {
        const timeout = setTimeout(() => {
            setMessage("🧙 Ah, welcome back young scholar!");
        }, 1000);
        return () => clearTimeout(timeout);
    }, []);

    const updateTitle = (xp) => {
        if (xp >= 300) setTitle("🧠 Enlightened One");
        else if (xp >= 200) setTitle("📚 Tenacious Seeker");
        else if (xp >= 100) setTitle("⚔️ Study Warrior");
        else setTitle("🎓 Novice Scholar");
    };

    const completeQuest = () => {
        const newXp = xp + 10;
        setXp(newXp);
        updateTitle(newXp);
        setMessage("✅ Quest complete!");
        setTimeout(() => {
            setMessage("🧙 Keep going, the arcane awaits...");
        }, 2000);
    };

    return (
        <div className="center-screen">
            <div className="card">
                <h1 className="title">🎉 Studium</h1>
                <Wizard message={message} />
                <h2 className="subtitle">{title}</h2>
                <p className="stats">XP: {xp}</p>
                <p className="stats">🔥 Streak: {streak} days</p>
                <button className="button" onClick={completeQuest}>✅ Complete Quest</button>
            </div>
        </div>
    );
};

export default App;

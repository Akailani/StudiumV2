import { useState, useEffect } from "react";
import "./index.css";

function getTodayDateStr() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

function getWizardMessage({ xp, streak }) {
    const messages = [
        `🔥 You’ve earned ${xp} XP! On fire 🔥`,
        streak > 0 ? `🔥 You’re on a ${streak}-day streak! Keep going!` : `Let’s get that streak going!`,
        "💀 Procrastinators fear you now...",
        "📖 Study magic intensifies!",
        "🧠 Remember: tiny tasks make mighty heroes.",
        "✨ New quest? I like your style.",
        "💧 Don’t forget hydration and rest too, hero.",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function App() {
    const [xp, setXP] = useState(() => parseInt(localStorage.getItem("studium-xp")) || 3200);
    const [quests, setQuests] = useState(() => JSON.parse(localStorage.getItem("studium-quests")) || [
        { id: 1, text: "Read Chapter 5", completed: false },
        { id: 2, text: "Review notes", completed: false },
        { id: 3, text: "Complete worksheet", completed: false },
    ]);
    const [streak, setStreak] = useState(() => parseInt(localStorage.getItem("studium-streak")) || 0);
    const [lastActiveDate, setLastActiveDate] = useState(() => localStorage.getItem("studium-lastActiveDate") || "");
    const [wizardMsg, setWizardMsg] = useState("🧙‍♂️ Alan! Let's complete your study quests!");
    const [bossProgress, setBossProgress] = useState(() => parseInt(localStorage.getItem("studium-boss")) || 0);
    const [newTask, setNewTask] = useState("");
    const [badges, setBadges] = useState(() => JSON.parse(localStorage.getItem("studium-badges")) || []);
    const [title, setTitle] = useState(() => localStorage.getItem("studium-title") || "Apprentice");

    useEffect(() => {
        const today = getTodayDateStr();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (lastActiveDate !== today) {
            setLastActiveDate(today);
            localStorage.setItem("studium-lastActiveDate", today);
            if (lastActiveDate === yesterdayStr) {
                setStreak(prev => prev + 1);
            } else {
                setStreak(0);
            }
            setBossProgress(0); // Daily reset of boss
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("studium-xp", xp);
        localStorage.setItem("studium-streak", streak);
        localStorage.setItem("studium-quests", JSON.stringify(quests));
        localStorage.setItem("studium-boss", bossProgress);
        localStorage.setItem("studium-badges", JSON.stringify(badges));
        localStorage.setItem("studium-title", title);
    }, [xp, streak, quests, bossProgress, badges, title]);

    useEffect(() => {
        setWizardMsg(getWizardMessage({ xp, streak }));
    }, [xp, streak]);

    function handleCompleteQuest(index) {
        const updatedQuests = [...quests];
        if (!updatedQuests[index].completed) {
            updatedQuests[index].completed = true;
            setXP(prev => prev + 100);
            setBossProgress(prev => Math.min(prev + 1, 6));
        }
        setQuests(updatedQuests);
    }

    function handleAddQuest() {
        if (newTask.trim() !== "") {
            const newQuest = { id: Date.now(), text: newTask, completed: false };
            setQuests([...quests, newQuest]);
            setNewTask("");
        }
    }

    useEffect(() => {
        const earned = [];
        if (quests.some(q => q.completed)) earned.push("✨ First Steps");
        if (xp >= 1000) earned.push("🔥 On Fire");
        if (streak >= 3) earned.push("🧙‍♂️ Consistent Wizard");
        setBadges(earned);

        if (xp > 5000) setTitle("Archmage");
        else if (xp > 3000) setTitle("Wizard");
        else if (xp > 1500) setTitle("Apprentice");
        else setTitle("Novice");
    }, [xp, streak, quests]);

    return (
        <div className="App">
            <h1>📘 Studium</h1>
            <h2>🧙‍♂️ Title: {title}</h2>
            <p>{wizardMsg}</p>
            <p>⭐ XP: {xp}</p>
            <p>🔥 Streak: {streak} days</p>
            <p>👾 Boss HP: {bossProgress}/6</p>
            <p>🏅 Badges: {badges.join(", ")}</p>

            <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="New quest..."
            />
            <button onClick={handleAddQuest}>Add</button>

            <ul>
                {quests.map((q, i) => (
                    <li key={q.id}>
                        <strong>{q.text}</strong>{" "}
                        {!q.completed && (
                            <button onClick={() => handleCompleteQuest(i)}>Complete</button>
                        )}
                    </li>
                ))}
            </ul>

            {bossProgress >= 6 && <p>🎉 You defeated the boss!</p>}
        </div>
    );
}

export default App;

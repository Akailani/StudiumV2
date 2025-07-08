import { useState, useEffect } from "react";
import "./index.css";

function getTodayDateStr() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

function getWizardMessage({ xp, streak }) {
    const messages = [
        `🔥 You've earned ${xp} XP! On fire 🔥`,
        streak > 0 ? `🔥 You're on a ${streak}-day streak! Keep going!` : `Let's get that streak started!`,
        "💀 Procrastinators fear you now...",
        "📖 Study magic intensifies!",
        "🧠 Remember: tiny tasks make mighty heroes.",
        "✨ New quest? I like your style.",
        "💧 Don’t forget hydration and rest too, hero.",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function App() {
    const [xp, setXP] = useState(() => parseInt(localStorage.getItem("studium-xp")) || 3600);
    const [quests, setQuests] = useState(() => JSON.parse(localStorage.getItem("studium-quests")) || [
        { id: 1, text: "Read Chapter 5", completed: false },
        { id: 2, text: "Review notes", completed: false },
        { id: 3, text: "Complete worksheet", completed: false },
    ]);
    const [streak, setStreak] = useState(() => parseInt(localStorage.getItem("studium-streak")) || 0);
    const [lastActiveDate, setLastActiveDate] = useState(() => localStorage.getItem("studium-lastActiveDate") || getTodayDateStr());
    const [wizardMsg, setWizardMsg] = useState("🧙‍♂️ Alan! Let's complete your study quests!");
    const [bossProgress, setBossProgress] = useState(() => parseInt(localStorage.getItem("studium-boss")) || 0);
    const [newTask, setNewTask] = useState("");
    const [badges, setBadges] = useState(() => JSON.parse(localStorage.getItem("studium-badges")) || []);

    useEffect(() => {
        localStorage.setItem("studium-xp", xp);
    }, [xp]);

    useEffect(() => {
        localStorage.setItem("studium-quests", JSON.stringify(quests));
    }, [quests]);

    useEffect(() => {
        localStorage.setItem("studium-streak", streak);
    }, [streak]);

    useEffect(() => {
        localStorage.setItem("studium-lastActiveDate", lastActiveDate);
    }, [lastActiveDate]);

    useEffect(() => {
        localStorage.setItem("studium-boss", bossProgress);
    }, [bossProgress]);

    useEffect(() => {
        localStorage.setItem("studium-badges", JSON.stringify(badges));
    }, [badges]);

    useEffect(() => {
        const today = getTodayDateStr();
        if (lastActiveDate !== today) {
            setLastActiveDate(today);
            setStreak(0);
            setWizardMsg(getWizardMessage({ xp, streak: 0 }));
        }
    }, []);

    useEffect(() => {
        setWizardMsg(getWizardMessage({ xp, streak }));
    }, [xp, streak]);

    function checkForNewBadges(xp, streak, quests) {
        const earned = [];
        if (quests.some((q) => q.completed)) earned.push("✨ First Steps");
        if (xp >= 1000) earned.push("🔥 On Fire");
        if (streak >= 3) earned.push("🧙‍♂️ Consistent Wizard");
        return earned;
    }

    const handleCompleteQuest = (id) => {
        const updated = quests.map((q) =>
            q.id === id ? { ...q, completed: true } : q
        );
        setQuests(updated);
        setXP((prev) => prev + 100);
        setStreak((prev) => prev + 1);
        setBossProgress((prev) => prev + 1);
        const earnedBadges = checkForNewBadges(xp + 100, streak + 1, updated);
        setBadges(earnedBadges);
    };

    const addQuest = () => {
        if (newTask.trim()) {
            const newQuest = {
                id: Date.now(),
                text: newTask.trim(),
                completed: false,
            };
            setQuests([...quests, newQuest]);
            setNewTask("");
        }
    };

    return (
        <div className="App">
            <div className="card">
                <h1>📘 Studium</h1>
                <p>{wizardMsg}</p>
                <p>⭐ XP: {xp}</p>
                <p>🔥 Streak: {streak} days</p>
                <p>👹 Boss HP: {bossProgress}/6</p>
                <p>🏅 Badges: {badges.join(", ")}</p>
                <input
                    type="text"
                    placeholder="New quest..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button onClick={addQuest}>Add</button>
                <ul>
                    {quests.map((q) => (
                        <li key={q.id} style={{ fontWeight: q.completed ? "bold" : "normal" }}>
                            {q.text} {!q.completed && (
                                <button onClick={() => handleCompleteQuest(q.id)}>Complete</button>
                            )}
                        </li>
                    ))}
                </ul>
                {bossProgress >= 6 && <p>🎉 You defeated the boss!</p>}
            </div>
        </div>
    );
}

export default App;

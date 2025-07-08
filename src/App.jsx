import { useState, useEffect } from "react";
import "./index.css";

function getTodayDateStr() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

function getWizardMessage(xp, streak) {
    const messages = [
        `🔥 You've earned ${xp} XP! On fire 🔥`,
        streak > 0
            ? `🔥 You're on a ${streak}-day streak! Keep going!`
            : "Let's get that streak started!",
        "⏳ Procrastinators fear you now...",
        "📖 Study magic intensifies!",
        "🧙 Remember: tiny tasks make mighty heroes.",
        "🧩 New quest? I like your style.",
        "💧 Don’t forget hydration and rest too, hero.",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function App() {
    const [xp, setXP] = useState(3200);
    const [quests, setQuests] = useState([
        { id: 1, text: "Read Chapter 5", completed: false },
        { id: 2, text: "Review notes", completed: false },
        { id: 3, text: "Complete worksheet", completed: false },
    ]);
    const [streak, setStreak] = useState(() => {
        const saved = localStorage.getItem("studium-streak");
        return saved ? parseInt(saved) : 0;
    });
    const [lastActiveDate, setLastActiveDate] = useState(() => {
        return localStorage.getItem("studium-lastActiveDate") || "";
    });
    const [wizardMsg, setWizardMsg] = useState("🧙 Alan! Let's complete your study quests!");
    const [bossProgress, setBossProgress] = useState(6);
    const [newTask, setNewTask] = useState("");
    const [badges, setBadges] = useState([]);

    // Badge check logic
    function checkForNewBadges(xp, streak, quests) {
        const earned = [];

        if (quests.some((q) => q.completed)) earned.push("✨ First Steps");
        if (xp >= 1000) earned.push("🔥 On Fire");
        if (streak >= 3) earned.push("🧙 Consistent Wizard");

        setBadges(earned);
    }

    useEffect(() => {
        checkForNewBadges(xp, streak, quests);
    }, [xp, streak, quests]);

    // Streak tracker
    useEffect(() => {
        const today = getTodayDateStr();
        if (lastActiveDate !== today) {
            if (lastActiveDate) {
                const diff = (new Date(today) - new Date(lastActiveDate)) / (1000 * 60 * 60 * 24);
                if (diff === 1) setStreak((prev) => prev + 1);
                else if (diff > 1) setStreak(0);
            }
            setLastActiveDate(today);
            localStorage.setItem("studium-lastActiveDate", today);
            localStorage.setItem("studium-streak", streak.toString());
        }
    }, []);

    function completeQuest(id) {
        const updated = quests.map((q) =>
            q.id === id ? { ...q, completed: true } : q
        );
        setQuests(updated);
        setXP((xp) => xp + 100);
        setBossProgress((hp) => Math.max(0, hp - 1));
        setWizardMsg(getWizardMessage(xp, streak));
    }

    function addQuest() {
        if (!newTask.trim()) return;
        const newQuest = {
            id: Date.now(),
            text: newTask,
            completed: false,
        };
        setQuests([...quests, newQuest]);
        setNewTask("");
    }

    return (
        <div className="app">
            <h1>📘 Studium</h1>
            <p className="wizard-msg">{wizardMsg}</p>

            <div className="stats">
                <p>⭐ XP: {xp}</p>
                <p>🔥 Streak: {streak} days</p>
                <p>👹 Boss HP: {bossProgress}/6</p>
                <p>🏅 Badges: {badges.join(", ") || "None yet"}</p>
            </div>

            <div className="task-input">
                <input
                    type="text"
                    placeholder="New quest..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button onClick={addQuest}>Add</button>
            </div>

            <ul className="quest-list">
                {quests.map((q) => (
                    <li key={q.id} className={q.completed ? "completed" : ""}>
                        <span>{q.text}</span>
                        {!q.completed && (
                            <button onClick={() => completeQuest(q.id)}>Complete</button>
                        )}
                    </li>
                ))}
            </ul>

            {bossProgress === 0 && (
                <div className="boss-defeated">🎉 You defeated the boss!</div>
            )}
        </div>
    );
}

export default App;

import { useState, useEffect } from "react";
import "./index.css";

function getTodayDateStr() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

function getWizardMessage({ xp, streak }) {
    const messages = [
        `🔥 You've earned ${xp} XP! On fire 🔥`,
        `${streak > 0 ? `🎯 You're on a ${streak}-day streak! Keep going!` : "💪 Let’s get that streak started!"}`,
        "😈 Procrastinators fear you now...",
        "📖 Study magic intensifies!",
        "🧠 Remember: tiny tasks make mighty heroes.",
        "🆕 New quest? I like your style.",
        "💧 Don’t forget hydration and rest too, hero.",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function App() {
    const [xp, setXP] = useState(3200);

    // ✅ Quests persist from localStorage
    const [quests, setQuests] = useState(() => {
        const saved = localStorage.getItem("studium-quests");
        return saved ? JSON.parse(saved) : [
            { id: 1, text: "Read Chapter 5", completed: false },
            { id: 2, text: "Review notes", completed: false },
            { id: 3, text: "Complete worksheet", completed: false },
        ];
    });

    useEffect(() => {
        localStorage.setItem("studium-quests", JSON.stringify(quests));
    }, [quests]);

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

    function checkForNewBadges({ xp, streak, quests }) {
        const earned = [];

        if (quests.some(q => q.completed)) {
            earned.push("✨ First Steps");
        }
        if (xp >= 1000) {
            earned.push("🔥 On Fire");
        }
        if (streak >= 3) {
            earned.push("🧙 Consistent Wizard");
        }

        setBadges(earned);
    }

    function completeQuest(id) {
        const updated = quests.map(q =>
            q.id === id ? { ...q, completed: true } : q
        );
        setQuests(updated);
        const newXP = xp + 100;
        setXP(newXP);
        setBossProgress(prev => prev + 1);
        checkForNewBadges({ xp: newXP, streak, quests: updated });
        setWizardMsg(getWizardMessage({ xp: newXP, streak }));
    }

    function addQuest() {
        if (newTask.trim() === "") return;
        const newQuest = {
            id: Date.now(),
            text: newTask,
            completed: false,
        };
        const updated = [...quests, newQuest];
        setQuests(updated);
        setNewTask("");
        setWizardMsg("🧙 A new challenge arises!");
    }

    return (
        <div className="app">
            <h1>📘 Studium</h1>
            <p>{wizardMsg}</p>
            <p>⭐ XP: {xp}</p>
            <p>🔥 Streak: {streak} days</p>
            <p>👹 Boss HP: {bossProgress}/6</p>
            <p>🏅 Badges: {badges.join(", ")}</p>

            <div>
                <input
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                    placeholder="New quest..."
                />
                <button onClick={addQuest}>Add</button>
            </div>

            <ul>
                {quests.map(q => (
                    <li key={q.id}>
                        {q.completed ? (
                            <b>{q.text}</b>
                        ) : (
                            <>
                                {q.text}{" "}
                                <button onClick={() => completeQuest(q.id)}>Complete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            {bossProgress >= 6 && <p>🎉 You defeated the boss!</p>}
        </div>
    );
}

export default App;

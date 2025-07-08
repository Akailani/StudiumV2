import { useState, useEffect } from "react";
import "./index.css";

function getTodayDateStr() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

function getWizardMessage({ xp, streak }) {
    const messages = [
        `🔥 You’ve earned ${xp} XP! On fire 🔥`,
        streak > 0 ? `🔥 You’re on a ${streak}-day streak! Keep going!` : `🔥 Let’s get that streak started!`,
        "🧠 Procrastinators fear you now...",
        "📚 Study magic intensifies!",
        "⚔️ Tiny tasks make mighty heroes.",
        "🧙 New quest? I like your style.",
        "💧 Don’t forget hydration and rest too, hero.",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function App() {
    const [xp, setXP] = useState(() => {
        const saved = localStorage.getItem("studium-xp");
        return saved ? parseInt(saved) : 2800;
    });

    const [quests, setQuests] = useState(() => {
        const saved = localStorage.getItem("studium-quests");
        return saved ? JSON.parse(saved) : [
            { id: 1, text: "Read Chapter 5", completed: false },
            { id: 2, text: "Review notes", completed: false },
            { id: 3, text: "Complete worksheet", completed: false },
        ];
    });

    const [streak, setStreak] = useState(() => {
        const saved = localStorage.getItem("studium-streak");
        return saved ? parseInt(saved) : 0;
    });

    const [lastActiveDate, setLastActiveDate] = useState(() => {
        return localStorage.getItem("studium-lastActiveDate") || "";
    });

    const [wizardMsg, setWizardMsg] = useState("");
    const [bossProgress, setBossProgress] = useState(0);
    const [newTask, setNewTask] = useState("");
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        const today = getTodayDateStr();
        if (lastActiveDate && lastActiveDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastActiveDate === yesterday.toISOString().split("T")[0]) {
                setStreak((prev) => prev + 1);
            } else {
                setStreak(0);
            }
        }
        setLastActiveDate(today);
        setWizardMsg(getWizardMessage({ xp, streak }));
    }, []);

    useEffect(() => {
        localStorage.setItem("studium-xp", xp);
        localStorage.setItem("studium-quests", JSON.stringify(quests));
        localStorage.setItem("studium-streak", streak);
        localStorage.setItem("studium-lastActiveDate", lastActiveDate);
    }, [xp, quests, streak, lastActiveDate]);

    function checkForNewBadges({ xp, streak, quests }) {
        const earned = [];
        if (quests.some((q) => q.completed)) {
            earned.push("✨ First Steps");
        }
        if (xp >= 1000) {
            earned.push("🔥 On Fire");
        }
        if (streak >= 3) {
            earned.push("🧊 Consistent Wizard");
        }
        return earned;
    }

    function handleComplete(id) {
        const updatedQuests = quests.map((q) =>
            q.id === id ? { ...q, completed: true } : q
        );
        setQuests(updatedQuests);
        const earnedXP = 100;
        const updatedXP = xp + earnedXP;
        const updatedBoss = bossProgress + 1;
        setXP(updatedXP);
        setBossProgress(updatedBoss);
        const earnedBadges = checkForNewBadges({ xp: updatedXP, streak, quests: updatedQuests });
        setBadges(earnedBadges);
        setWizardMsg(getWizardMessage({ xp: updatedXP, streak }));
        if (updatedBoss >= 6) {
            setBossProgress(0);
        }
    }

    function handleAddTask() {
        if (newTask.trim() === "") return;
        const newQuest = {
            id: Date.now(),
            text: newTask,
            completed: false,
        };
        setQuests([...quests, newQuest]);
        setNewTask("");
    }

    return (
        <div className="App" style={{ fontFamily: "Arial", background: "#f7f7f7", padding: "2rem" }}>
            <div style={{ maxWidth: "600px", margin: "auto", background: "white", padding: "2rem", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
                <h1>📘 Studium</h1>
                <p>{wizardMsg}</p>
                <p>⭐ XP: {xp}</p>
                <p>🔥 Streak: {streak} days</p>
                <p>👾 Boss HP: {Math.min(bossProgress, 6)}/6</p>
                <p>🏅 Badges: {badges.join(", ")}</p>

                <div style={{ marginTop: "1rem" }}>
                    <input
                        type="text"
                        value={newTask}
                        placeholder="New quest..."
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                    <button onClick={handleAddTask}>Add</button>
                </div>

                <ul style={{ textAlign: "left", marginTop: "1rem" }}>
                    {quests.map((q) => (
                        <li key={q.id} style={{ fontWeight: q.completed ? "bold" : "normal" }}>
                            {q.text} {!q.completed && <button onClick={() => handleComplete(q.id)}>Complete</button>}
                        </li>
                    ))}
                </ul>

                {bossProgress >= 6 && <p>🎉 You defeated the boss!</p>}
            </div>
        </div>
    );
}

export default App;

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
    const [xp, setXP] = useState(() => {
        const saved = localStorage.getItem("studium-xp");
        return saved ? parseInt(saved) : 3200;
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

    const [wizardMsg, setWizardMsg] = useState("🧙‍♂️ Alan! Let's complete your study quests!");
    const [bossProgress, setBossProgress] = useState(0);
    const [newTask, setNewTask] = useState("");
    const [badges, setBadges] = useState(() => []);

    useEffect(() => {
        const today = getTodayDateStr();
        if (lastActiveDate !== today) {
            if (lastActiveDate === getTodayDateStr(new Date(Date.now() - 86400000))) {
                setStreak(prev => prev + 1);
            } else {
                setStreak(0);
            }
            setLastActiveDate(today);
            localStorage.setItem("studium-lastActiveDate", today);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("studium-xp", xp);
        localStorage.setItem("studium-streak", streak);
        localStorage.setItem("studium-quests", JSON.stringify(quests));
    }, [xp, streak, quests]);

    useEffect(() => {
        setWizardMsg(getWizardMessage({ xp, streak }));
    }, [xp, streak]);

    function handleCompleteQuest(index) {
        const updatedQuests = [...quests];
        if (!updatedQuests[index].completed) {
            updatedQuests[index].completed = true;
            setXP(prev => prev + 100);
            setBossProgress(prev => Math.min(prev + 1, 6)); // ✅ Cap boss HP at 6
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
    }, [xp, streak, quests]);

    return (
        <div className="App">
            <h1>📘 Studium</h1>
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

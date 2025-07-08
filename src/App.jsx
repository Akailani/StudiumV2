import { useState, useEffect } from "react";
import "./index.css";

function getTodayDateStr() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

function getWizardMessage({ xp, streak }) {
    const messages = [
        `🔥 You've earned ${xp} XP! On fire 🔥`,
        streak > 0 ? `🔥 You're on a ${streak}-day streak! Keep going!` : "Let's get that streak started!",
        "🌀 Procrastinators fear you now...",
        "🧙‍♂️ Study magic intensifies!",
        "📚 Tiny tasks make mighty heroes.",
        "🎯 New quest? I like your style.",
        "💧 Don’t forget hydration and rest too, hero.",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function App() {
    const [xp, setXP] = useState(() => Number(localStorage.getItem("studium-xp")) || 0);
    const [quests, setQuests] = useState(() => {
        const saved = localStorage.getItem("studium-quests");
        return saved ? JSON.parse(saved) : [
            { id: 1, text: "Read Chapter 5", completed: false },
            { id: 2, text: "Review notes", completed: false },
            { id: 3, text: "Complete worksheet", completed: false },
        ];
    });

    const [streak, setStreak] = useState(() => Number(localStorage.getItem("studium-streak")) || 0);
    const [lastActiveDate, setLastActiveDate] = useState(() => localStorage.getItem("studium-lastActiveDate") || "");
    const [wizardMsg, setWizardMsg] = useState("🧙‍♂️ Alan! Let's complete your study quests!");
    const [bossProgress, setBossProgress] = useState(() => Number(localStorage.getItem("studium-boss")) || 0);
    const [newTask, setNewTask] = useState("");
    const [badges, setBadges] = useState(() => {
        const saved = localStorage.getItem("studium-badges");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("studium-xp", xp);
        localStorage.setItem("studium-streak", streak);
        localStorage.setItem("studium-lastActiveDate", getTodayDateStr());
        localStorage.setItem("studium-boss", bossProgress);
        localStorage.setItem("studium-quests", JSON.stringify(quests));
        localStorage.setItem("studium-badges", JSON.stringify(badges));
    }, [xp, streak, bossProgress, quests, badges]);

    useEffect(() => {
        const today = getTodayDateStr();
        if (lastActiveDate !== today) {
            if (
                new Date(today).getTime() - new Date(lastActiveDate).getTime() ===
                24 * 60 * 60 * 1000
            ) {
                setStreak((s) => s + 1);
            } else {
                setStreak(0);
            }
            setLastActiveDate(today);
        }

        setWizardMsg(getWizardMessage({ xp, streak }));
    }, []);

    function checkForNewBadges({ xp, streak, quests }) {
        const earned = [];

        if (quests.some((q) => q.completed)) earned.push("✨ First Steps");
        if (xp >= 1000) earned.push("🔥 On Fire");
        if (streak >= 3) earned.push("🧊 Consistent Wizard");

        return earned.filter((badge) => !badges.includes(badge));
    }

    function handleComplete(id) {
        const updated = quests.map((q) =>
            q.id === id ? { ...q, completed: true } : q
        );
        setQuests(updated);
        setXP((xp) => xp + 100);
        setBossProgress((prev) => {
            const next = prev + 1;
            return next > 6 ? 6 : next;
        });

        const newlyEarned = checkForNewBadges({ xp: xp + 100, streak, quests: updated });
        if (newlyEarned.length > 0) {
            setBadges((prev) => [...prev, ...newlyEarned]);
        }
    }

    function handleAddQuest() {
        if (newTask.trim()) {
            setQuests((prev) => [
                ...prev,
                { id: Date.now(), text: newTask.trim(), completed: false },
            ]);
            setNewTask("");
        }
    }

    function handleBossDefeated() {
        setBossProgress(0);
        setXP((xp) => xp + 500);
        setWizardMsg("🎉 You defeated the boss!");
    }

    const allDone = quests.every((q) => q.completed);
    const bossDefeated = bossProgress >= 6;

    return (
        <div className="app">
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
                {quests.map((q) => (
                    <li key={q.id}>
                        <strong>{q.text}</strong>{" "}
                        {!q.completed && (
                            <button onClick={() => handleComplete(q.id)}>Complete</button>
                        )}
                    </li>
                ))}
            </ul>

            {bossDefeated && (
                <p>
                    🎉 You defeated the boss!{" "}
                    <button onClick={handleBossDefeated}>Reset Boss</button>
                </p>
            )}
        </div>
    );
}

export default App;

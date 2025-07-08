import { useState, useEffect } from "react";
import "./index.css";

function getTodayDateStr() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

function getWizardMessage({ xp, streak }) {
    const messages = [
        `🔥 You've earned ${xp} XP! On fire 🔥`,
        streak > 0 ? `🔥 You're on a ${streak}-day streak! Keep going!` : "Let's get that streak going!",
        "🌀 Procrastinators fear you now...",
        "📖 Study magic intensifies!",
        "🧠 Tiny tasks make mighty heroes.",
        "🧙‍♂️ New quest? I like your style.",
        "💧 Don’t forget hydration and rest too, hero.",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function App() {
    const [xp, setXP] = useState(2800);
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

    const [lastActiveDate, setLastActiveDate] = useState(() =>
        localStorage.getItem("studium-lastActiveDate") || ""
    );

    const [wizardMsg, setWizardMsg] = useState("🧙‍♂️ Alan! Let's complete your study quests!");
    const [bossProgress, setBossProgress] = useState(6);
    const [newTask, setNewTask] = useState("");
    const [badges, setBadges] = useState([]);
    const [title, setTitle] = useState("Novice Wizard");
    const [leaderboard, setLeaderboard] = useState([
        { name: "Alan", xp: 2800 },
        { name: "Luna", xp: 2400 },
        { name: "Kai", xp: 2000 },
    ]);

    function checkForNewBadges(xp, streak, quests) {
        const earned = [];
        if (quests.some((q) => q.completed)) earned.push("✨ First Steps");
        if (xp >= 1000) earned.push("🔥 On Fire");
        if (streak >= 3) earned.push("🧊 Consistent Wizard");
        return earned;
    }

    useEffect(() => {
        const today = getTodayDateStr();
        if (lastActiveDate !== today) {
            setLastActiveDate(today);
            localStorage.setItem("studium-lastActiveDate", today);
            if (quests.some((q) => q.completed)) {
                setStreak((prev) => {
                    const newStreak = prev + 1;
                    localStorage.setItem("studium-streak", newStreak);
                    return newStreak;
                });
            } else {
                setStreak(0);
                localStorage.setItem("studium-streak", "0");
            }
        }
    }, [quests, lastActiveDate]);

    useEffect(() => {
        setWizardMsg(getWizardMessage({ xp, streak }));
        const earned = checkForNewBadges(xp, streak, quests);
        setBadges(earned);

        if (xp < 1000) setTitle("Novice Wizard");
        else if (xp < 3000) setTitle("Fire Adept");
        else if (xp < 5000) setTitle("Arcane Scholar");
        else setTitle("Master of Quests");

        localStorage.setItem("studium-quests", JSON.stringify(quests));
    }, [xp, streak, quests]);

    function completeQuest(index) {
        const updated = [...quests];
        updated[index].completed = true;
        setQuests(updated);
        setXP((prev) => prev + 100);
        setBossProgress((prev) => {
            const next = prev + 1;
            return next > 6 ? 6 : next;
        });
    }

    function addQuest() {
        if (!newTask.trim()) return;
        const newQuest = { id: Date.now(), text: newTask.trim(), completed: false };
        setQuests([...quests, newQuest]);
        setNewTask("");
    }

    return (
        <div className="app">
            <h1>📘 Studium</h1>
            <p className="fade-in">{wizardMsg}</p>
            <p>🏆 Title: {title}</p>
            <p>⭐ XP: {xp}</p>
            <p>🔥 Streak: {streak} days</p>
            <p>👾 Boss HP: {bossProgress}/6</p>
            <p>🏅 Badges: {badges.join(", ")}</p>

            <input
                type="text"
                placeholder="New quest..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
            />
            <button onClick={addQuest}>Add</button>

            <ul>
                {quests.map((q, i) => (
                    <li key={q.id} style={{ fontWeight: q.completed ? "bold" : "normal" }}>
                        {q.text} {!q.completed && <button onClick={() => completeQuest(i)}>Complete</button>}
                    </li>
                ))}
            </ul>

            {bossProgress >= 6 && <p className="fade-in">🎉 You defeated the boss!</p>}

            <h2>🏆 Leaderboard</h2>
            <ul>
                {leaderboard.sort((a, b) => b.xp - a.xp).map((user, i) => (
                    <li key={i}>
                        {i + 1}. {user.name} — {user.xp} XP
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;

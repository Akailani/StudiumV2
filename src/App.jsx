import { useState, useEffect } from "react";
import "./index.css";

function getTodayDateStr() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function getWizardMessage({ xp, streak }) {
  const messages = [
    `🧙 You’ve earned ${xp} XP! On fire 🔥`,
    `🧙 ${streak > 0 ? `You're on a ${streak}-day streak! Keep going!` : "Let’s get that streak started!"}`,
    "🧙 Procrastinators fear you now...",
    "🧙 Study magic intensifies!",
    "🧙 Remember: tiny tasks make mighty heroes.",
    "🧙 New quest? I like your style.",
    "🧙 Don’t forget hydration and rest too, hero.",
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

  function checkForNewBadges({ xp, streak, quests }) {
    const earned = [];

    if (quests.some(q => q.completed)) {
      earned.push("⭐ First Steps");
    }
    if (xp >= 1000) {
      earned.push("🔥 On Fire");
    }
    if (streak >= 3) {
      earned.push("📆 Consistent Wizard");
    }
    if (xp >= 5000) {
      earned.push("🏆 Legendary Learner");
    }

    setBadges((prev) => {
      const unique = new Set([...prev, ...earned]);
      return Array.from(unique);
    });
  }

  const completeQuest = (id) => {
    const quest = quests.find((q) => q.id === id);
    if (quest.completed) return;

    const today = getTodayDateStr();

    if (today !== lastActiveDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yestStr = yesterday.toISOString().split("T")[0];

      if (lastActiveDate === yestStr) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem("studium-streak", newStreak);
      } else {
        setStreak(1);
        localStorage.setItem("studium-streak", 1);
      }

      setLastActiveDate(today);
      localStorage.setItem("studium-lastActiveDate", today);
    }

    const newQuests = quests.map((quest) =>
      quest.id === id ? { ...quest, completed: true } : quest
    );
    setQuests(newQuests);
    setXP((prevXP) => prevXP + 100);
    setBossProgress((prev) => Math.min(prev + 1, 10));
    setWizardMsg(getWizardMessage({ xp: xp + 100, streak }));
    checkForNewBadges({ xp: xp + 100, streak, quests: newQuests });
  };

  const addQuest = () => {
    if (newTask.trim() === "") return;
    const newQuest = { id: Date.now(), text: newTask, completed: false };
    const updated = [...quests, newQuest];
    setQuests(updated);
    setNewTask("");
    setWizardMsg("🧙 New quest? I like your style.");
    checkForNewBadges({ xp, streak, quests: updated });
  };

  return (
    <div className="app">
      <h1>STUDIUM</h1>
      <p>{xp} XP</p>
      <p>🔥 Streak: {streak} day{streak !== 1 ? "s" : ""}</p>

      {badges.length > 0 && (
        <div className="section">
          <h2>🎖️ Badges Unlocked</h2>
          <ul>
            {badges.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="wizard">{wizardMsg}</div>

      <div className="section">
        <h2>Daily Quests</h2>
        {quests.map((q) => (
          <div
            key={q.id}
            onClick={() => completeQuest(q.id)}
            className="quest"
            style={{
              textDecoration: q.completed ? "line-through" : "none",
              opacity: q.completed ? 0.6 : 1,
            }}
          >
            ☐ {q.text} {q.completed ? "✅" : ""} +100XP
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Boss Battle 🐉</h2>
        <p>{bossProgress}/10 Hours</p>
        <div
          style={{
            height: "10px",
            background: "#ddd",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(bossProgress / 10) * 100}%`,
              height: "100%",
              background: "green",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      <div className="section">
        <h2>Add Task</h2>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New quest..."
        />
        <button onClick={addQuest}>Add</button>
      </div>
    </div>
  );
}

export default App;

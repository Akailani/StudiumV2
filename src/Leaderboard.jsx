// Leaderboard.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const sorted = data.sort((a, b) => b.xp - a.xp).slice(0, 10);
      setLeaders(sorted);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="p-4 mt-4 bg-white rounded-xl shadow-xl max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">🏆 Leaderboard</h2>
      <ul>
        {leaders.map((user, index) => (
          <li key={user.id} className="flex justify-between py-2 border-b">
            <span>#{index + 1} {user.name || user.id}</span>
            <span>{user.xp} XP</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;

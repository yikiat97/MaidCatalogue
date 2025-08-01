// src/pages/AdminUserRecommendationPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AdminUserRecommendationPage = () => {
  const { userId } = useParams();

  const [maids, setMaids] = useState([]);
  const [recommendedIds, setRecommendedIds] = useState([]);

useEffect(() => {
  if (!userId) return;

  const fetchData = async () => {
    try {
      const resMaids = await fetch(`http://localhost:3000/api/maids`);
      const allMaids = await resMaids.json(); // ✅ parse JSON

      const resRecommendations = await fetch(`http://localhost:3000/api/user/recommendation/user/${userId}`);
      const recommendations = await resRecommendations.json(); // ✅ parse JSON

      setMaids(allMaids);
      setRecommendedIds(recommendations.map((r) => r.id));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, [userId]);

  const toggleRecommendation = async (maidId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/user/recommendation/${userId}/${maidId}`, {
        method: 'POST',
      });

      const { status } = await res.json();

      if (status === 'added') {
        setRecommendedIds((prev) => [...prev, maidId]);
      } else if (status === 'removed') {
        setRecommendedIds((prev) => prev.filter((id) => id !== maidId));
      }
    } catch (error) {
      console.error('Failed to toggle recommendation:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Recommendations for User {userId}</h2>

      <div className="grid grid-cols-2 gap-4">
        {maids.map((maid) => (
          <div key={maid.id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{maid.name}</p>
              <p className="text-sm text-gray-500">{maid.nationality}</p>
              <p className="text-xs text-gray-400">ID: {maid.id}</p>
            </div>
            <input
              type="checkbox"
              checked={recommendedIds.includes(maid.id)}
              onChange={() => toggleRecommendation(maid.id)}
              className="h-4 w-4"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUserRecommendationPage;

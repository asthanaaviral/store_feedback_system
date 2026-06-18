import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon, label, value, bgColor }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${bgColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-slate-800 mt-1">
        {value !== undefined ? value.toLocaleString() : '—'}
      </p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setStats(res.data))
      .catch(() => setError('Could not load dashboard stats.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back, <span className="font-medium text-slate-700">{user?.name?.split(' ')[0]}</span>! Here's an overview.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-5">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="dashboard-stats">
          <StatCard icon="👥" label="Total Users" value={stats?.totalUsers} bgColor="bg-blue-50" />
          <StatCard icon="🏪" label="Total Stores" value={stats?.totalStores} bgColor="bg-emerald-50" />
          <StatCard icon="⭐" label="Total Ratings" value={stats?.totalRatings} bgColor="bg-yellow-50" />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

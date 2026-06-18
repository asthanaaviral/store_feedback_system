import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import StarRating from '../../components/common/StarRating';

const roleBadgeClass = {
  admin: 'bg-purple-100 text-purple-700',
  user: 'bg-blue-100 text-blue-700',
  store_owner: 'bg-emerald-100 text-emerald-700',
};
const roleLabel = { admin: 'Admin', user: 'User', store_owner: 'Store Owner' };

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/admin/users/${id}`)
      .then(res => setUser(res.data))
      .catch(() => setError('User not found or could not be loaded.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg">
        <button onClick={() => navigate('/admin/users')} className="text-slate-400 hover:text-slate-600 text-sm mb-4 block">← Back to Users</button>
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/users')} className="text-slate-400 hover:text-slate-600 text-sm transition-colors">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-slate-800">User Details</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{user.name}</h2>
            <p className="text-slate-500 text-sm">{user.email}</p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleBadgeClass[user.role] || 'bg-gray-100 text-gray-600'}`}>
            {roleLabel[user.role] || user.role}
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <span className="text-slate-500 w-20 shrink-0">Name</span>
            <span className="text-slate-800 font-medium">{user.name}</span>
          </div>
          <div className="flex gap-3">
            <span className="text-slate-500 w-20 shrink-0">Email</span>
            <span className="text-slate-800">{user.email}</span>
          </div>
          <div className="flex gap-3">
            <span className="text-slate-500 w-20 shrink-0">Address</span>
            <span className="text-slate-800">{user.address}</span>
          </div>
          <div className="flex gap-3">
            <span className="text-slate-500 w-20 shrink-0">Role</span>
            <span className="text-slate-800">{roleLabel[user.role] || user.role}</span>
          </div>
        </div>
      </div>

     
      {user.role === 'store_owner' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
            Owned Stores & Ratings
          </h3>
          {user.stores && user.stores.length > 0 ? (
            <div className="space-y-4">
              {user.stores.map(store => (
                <div key={store.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{store.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{store.address}</p>
                    </div>
                    <div className="text-right">
                      <StarRating value={Math.round(store.avgRating)} readOnly size="sm" />
                      <p className="text-xs text-slate-500 mt-1">
                        {parseFloat(store.avgRating).toFixed(1)} avg · {store.totalRatings} rating{store.totalRatings !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No stores assigned to this owner yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDetail;

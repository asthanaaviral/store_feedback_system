import { useState, useEffect } from 'react';
import api from '../../api/axios';
import StarRating from '../../components/common/StarRating';
import SortableTable from '../../components/common/SortableTable';

const StoreOwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/storeowner/dashboard')
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'name', label: 'Customer Name', sortable: false },
    { key: 'email', label: 'Email', sortable: false },
    {
      key: 'rating',
      label: 'Rating Given',
      sortable: false,
      render: (val) => (
        <div className="flex items-center gap-2">
          <StarRating value={val} readOnly size="sm" />
          <span className="text-xs text-slate-500">{val}/5</span>
        </div>
      ),
    },
    {
      key: 'updated_at',
      label: 'Date',
      sortable: false,
      render: (val) => (
        <span className="text-slate-500 text-sm">
          {new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-400 text-sm animate-pulse">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm max-w-lg">
        {error}
      </div>
    );
  }

  if (!data?.store) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-4">🏪</p>
        <h2 className="text-lg font-semibold text-slate-700 mb-2">No Store Assigned</h2>
        <p className="text-slate-500 text-sm">Your account hasn't been linked to a store yet. Contact the admin.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">My Store Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of ratings for your store</p>
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="sm:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Your Store</p>
          <h2 className="text-xl font-bold text-slate-800">{data.store.name}</h2>
          <p className="text-slate-500 text-sm mt-1">{data.store.address}</p>
          <p className="text-slate-400 text-xs mt-1">{data.store.email}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col items-center justify-center gap-2">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Average Rating</p>
          <p className="text-4xl font-bold text-slate-800">{data.avgRating.toFixed(1)}</p>
          <StarRating value={Math.round(data.avgRating)} readOnly size="md" />
          <p className="text-xs text-slate-500">{data.totalRatings} review{data.totalRatings !== 1 ? 's' : ''}</p>
        </div>
      </div>

     
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-3">
          Customer Ratings
        </h2>

        {data.raters.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400 text-sm">
            No ratings received yet. Share your store to get started!
          </div>
        ) : (
          <SortableTable
            columns={columns}
            data={data.raters}
            emptyMessage="No ratings yet."
          />
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;

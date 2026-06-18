import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import SortableTable from '../../components/common/SortableTable';
import StarRating from '../../components/common/StarRating';

const ManageStores = () => {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [applied, setApplied] = useState({});

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { ...applied, sortBy, order: sortOrder };
      const res = await api.get('/admin/stores', { params });
      setStores(res.data);
    } catch {
      setError('Failed to load stores.');
    } finally {
      setLoading(false);
    }
  }, [applied, sortBy, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const applyFilters = (e) => {
    e.preventDefault();
    setApplied({ ...filters });
  };

  const clearFilters = () => {
    setFilters({ name: '', email: '', address: '' });
    setApplied({});
  };

  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'avgRating',
      label: 'Rating',
      sortable: false,
      render: (val) => (
        <div className="flex items-center gap-2">
          <StarRating value={Math.round(parseFloat(val))} readOnly size="sm" />
          <span className="text-xs text-slate-500">{parseFloat(val).toFixed(1)}</span>
        </div>
      ),
    },
    {
      key: 'totalRatings',
      label: 'Reviews',
      sortable: false,
      render: (val) => <span className="text-slate-500 text-sm">{val}</span>,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Manage Stores</h1>
          <p className="text-slate-500 text-sm mt-1">View all registered stores and their ratings</p>
        </div>
        <button
          id="add-store-btn"
          onClick={() => navigate('/admin/stores/add')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Add Store
        </button>
      </div>

      <form onSubmit={applyFilters} className="bg-white rounded-xl border border-slate-200 p-4 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {['name', 'email', 'address'].map(field => (
            <input
              key={field}
              id={`store-filter-${field}`}
              type="text"
              value={filters[field]}
              onChange={(e) => setFilters(p => ({ ...p, [field]: e.target.value }))}
              placeholder={`Filter by ${field}...`}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">
            Apply Filters
          </button>
          <button type="button" onClick={clearFilters} className="border border-slate-300 hover:bg-slate-50 text-slate-600 text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">
            Clear
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-sm animate-pulse">
          Loading stores...
        </div>
      ) : (
        <SortableTable
          columns={columns}
          data={stores}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          emptyMessage="No stores match your filters."
        />
      )}

      <p className="text-xs text-slate-400 mt-3">{stores.length} store{stores.length !== 1 ? 's' : ''} found</p>
    </div>
  );
};

export default ManageStores;

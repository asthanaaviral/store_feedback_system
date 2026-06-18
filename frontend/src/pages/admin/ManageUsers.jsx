import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import SortableTable from '../../components/common/SortableTable';

const roleBadgeClass = {
  admin: 'bg-purple-100 text-purple-700',
  user: 'bg-blue-100 text-blue-700',
  store_owner: 'bg-emerald-100 text-emerald-700',
};

const roleLabel = { admin: 'Admin', user: 'User', store_owner: 'Store Owner' };

const ManageUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [applied, setApplied] = useState({});

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { ...applied, sortBy, order: sortOrder };
      const res = await api.get('/admin/users', { params });
      setUsers(res.data);
    } catch {
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [applied, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
    const empty = { name: '', email: '', address: '', role: '' };
    setFilters(empty);
    setApplied({});
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (val) => (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleBadgeClass[val] || 'bg-gray-100 text-gray-700'}`}>
          {roleLabel[val] || val}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Manage Users</h1>
          <p className="text-slate-500 text-sm mt-1">View all users — click a row to see details</p>
        </div>
        <button
          id="add-user-btn"
          onClick={() => navigate('/admin/users/add')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Add User
        </button>
      </div>

      <form onSubmit={applyFilters} className="bg-white rounded-xl border border-slate-200 p-4 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {['name', 'email', 'address'].map((field) => (
            <input
              key={field}
              id={`filter-${field}`}
              type="text"
              name={field}
              value={filters[field]}
              onChange={(e) => setFilters(p => ({ ...p, [field]: e.target.value }))}
              placeholder={`Filter by ${field}...`}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
          <select
            id="filter-role"
            name="role"
            value={filters.role}
            onChange={(e) => setFilters(p => ({ ...p, role: e.target.value }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
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
          Loading users...
        </div>
      ) : (
        <SortableTable
          columns={columns}
          data={users}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
          emptyMessage="No users match your filters."
        />
      )}

      <p className="text-xs text-slate-400 mt-3">
        {users.length} user{users.length !== 1 ? 's' : ''} found
      </p>
    </div>
  );
};

export default ManageUsers;

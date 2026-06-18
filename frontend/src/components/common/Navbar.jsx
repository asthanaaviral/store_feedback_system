import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleBadge = {
    admin: { label: 'Admin', className: 'bg-purple-100 text-purple-700' },
    user: { label: 'User', className: 'bg-blue-100 text-blue-700' },
    store_owner: { label: 'Store Owner', className: 'bg-green-100 text-green-700' },
  };

  const badge = roleBadge[user?.role] || { label: user?.role, className: 'bg-gray-100 text-gray-700' };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
      <div />

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-800">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badge.className}`}>
          {badge.label}
        </span>
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="text-sm text-red-600 hover:text-red-700 font-medium border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '▦' },
  { to: '/admin/users', label: 'Manage Users', icon: '👥' },
  { to: '/admin/stores', label: 'Manage Stores', icon: '🏪' },
];

const userLinks = [
  { to: '/user/stores', label: 'Browse Stores', icon: '🏪' },
  { to: '/user/update-password', label: 'Update Password', icon: '🔑' },
];

const storeOwnerLinks = [
  { to: '/store-owner/dashboard', label: 'Dashboard', icon: '▦' },
  { to: '/store-owner/update-password', label: 'Update Password', icon: '🔑' },
];

const Sidebar = () => {
  const { role } = useAuth();

  const links =
    role === 'admin' ? adminLinks :
    role === 'user' ? userLinks :
    role === 'store_owner' ? storeOwnerLinks : [];

  return (
    <aside className="w-60 bg-slate-800 flex flex-col shrink-0">
      <div className="px-5 py-5 border-b border-slate-700">
        <h1 className="text-white font-bold text-xl leading-tight">
          Store Rating
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">Platform</p>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <span className="text-base leading-none">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-slate-700">
        <p className="text-slate-500 text-xs">Made with ❤️ by Aviral.</p>
      </div>
    </aside>
  );
};

export default Sidebar;

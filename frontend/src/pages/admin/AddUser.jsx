import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { validateForm } from '../../utils/validators';

const AddUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { errors: valErrors } = validateForm(form, ['name', 'email', 'address', 'password']);
    if (Object.keys(valErrors).length > 0) { setErrors(valErrors); return; }

    setLoading(true);
    setApiError('');

    try {
      await api.post('/admin/users', form);
      setSuccess(true);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-slate-300'
    }`;

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center mt-12">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-2xl">✓</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">User Created!</h2>
        <p className="text-slate-500 text-sm mb-6">The user account has been successfully created.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setForm({ name: '', email: '', address: '', password: '', role: 'user' }); setSuccess(false); }}
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium px-5 py-2 rounded-lg text-sm transition-colors"
          >
            Add Another
          </button>
          <button
            onClick={() => navigate('/admin/users')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors"
          >
            View All Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/users')}
          className="text-slate-400 hover:text-slate-600 text-sm transition-colors"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Add New User</h1>
          <p className="text-slate-500 text-sm mt-0.5">Create a new user account with any role</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-5">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} id="add-user-form" noValidate className="space-y-4">
          <div>
            <label htmlFor="user-name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Full Name <span className="text-slate-400 text-xs font-normal">(20–60 characters)</span>
            </label>
            <input id="user-name" type="text" name="name" value={form.name} onChange={handleChange}
              placeholder="Enter full name" className={inputClass('name')} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="user-email" className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
            <input id="user-email" type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="user@example.com" className={inputClass('email')} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="user-address" className="block text-sm font-medium text-slate-700 mb-1.5">
              Address <span className="text-slate-400 text-xs font-normal">(max 400 characters)</span>
            </label>
            <textarea id="user-address" name="address" value={form.address} onChange={handleChange}
              rows={2} placeholder="Enter address" className={`${inputClass('address')} resize-none`} />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          <div>
            <label htmlFor="user-password" className="block text-sm font-medium text-slate-700 mb-1.5">
              Password <span className="text-slate-400 text-xs font-normal">(8–16 chars, 1 uppercase, 1 special)</span>
            </label>
            <input id="user-password" type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="Set a password" className={inputClass('password')} />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="user-role" className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
            <select id="user-role" name="role" value={form.role} onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="user">Normal User</option>
              <option value="store_owner">Store Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/admin/users')}
              className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-lg text-sm transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;

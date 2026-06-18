import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageStores from './pages/admin/ManageStores';
import AddUser from './pages/admin/AddUser';
import AddStore from './pages/admin/AddStore';
import UserDetail from './pages/admin/UserDetail';

import StoreList from './pages/user/StoreList';
import UserUpdatePassword from './pages/user/UpdatePassword';

import StoreOwnerDashboard from './pages/storeowner/Dashboard';
import StoreOwnerUpdatePassword from './pages/storeowner/UpdatePassword';


const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/users/add" element={<AddUser />} />
            <Route path="/admin/users/:id" element={<UserDetail />} />
            <Route path="/admin/stores" element={<ManageStores />} />
            <Route path="/admin/stores/add" element={<AddStore />} />
          </Route>

          {/* Normal user routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/user/stores" element={<StoreList />} />
            <Route path="/user/update-password" element={<UserUpdatePassword />} />
          </Route>

          {/* Store owner routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['store_owner']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/store-owner/dashboard" element={<StoreOwnerDashboard />} />
            <Route path="/store-owner/update-password" element={<StoreOwnerUpdatePassword />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};


export default App;
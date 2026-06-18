import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div id="not-found-page" className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-5xl font-bold text-gray-800">404</h1>
      <p className="text-gray-500">Page not found.</p>
      <Link to="/login" className="text-blue-600 hover:underline">Go to Login</Link>
    </div>
  );
};
export default NotFound;

import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, Home, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold">
            CourseMaster
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 hover:text-blue-200">
              <Home size={20} />
              Courses
            </Link>

            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 hover:text-blue-200"
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>
                <div className="flex items-center gap-2">
                  <User size={20} />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
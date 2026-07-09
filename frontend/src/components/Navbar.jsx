import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, BookOpen, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = user
    ? [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Courses', path: '/courses' },
        { name: 'My Courses', path: '/my-courses' },
        { name: 'Profile', path: '/profile' },
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Courses', path: '/courses' },
      ];

  return (
    <nav className="sticky top-0 z-50 glass-card border-b-0 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-[var(--color-primary-dark)]" />
              <span className="font-bold text-xl tracking-tight text-[var(--color-text-main)]">
                SkillSphere
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-yellow-200">
                <div className="flex items-center space-x-2">
                  <div className="bg-[var(--color-primary)] text-[var(--color-text-main)] p-2 rounded-full">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-[var(--color-text-main)] font-semibold hover:text-[var(--color-primary-dark)] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-[var(--color-text-main)] text-[var(--color-background)] px-4 py-2 rounded-lg font-semibold hover:bg-[var(--color-text-muted)] transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[var(--color-text-main)] hover:text-[var(--color-primary-dark)] p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-yellow-50"
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <>
                  <div className="px-3 py-2 flex items-center space-x-2 border-t border-yellow-200 mt-2">
                    <User className="h-5 w-5" />
                    <span className="font-semibold">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="pt-4 flex flex-col space-y-2 border-t border-yellow-200">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-center rounded-md font-semibold text-[var(--color-text-main)] bg-yellow-100"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-center rounded-md font-semibold bg-[var(--color-text-main)] text-[var(--color-background)]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

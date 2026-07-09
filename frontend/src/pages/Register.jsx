import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, BookOpen, GraduationCap } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md p-8 rounded-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-[var(--color-text-muted)]">Join SkillSphere today</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-[var(--color-text-muted)]" />
              </div>
              <input
                type="text"
                required
                className="input-field pl-10"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[var(--color-text-muted)]" />
              </div>
              <input
                type="email"
                required
                className="input-field pl-10"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[var(--color-text-muted)]" />
              </div>
              <input
                type="password"
                required
                className="input-field pl-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all ${
                  role === 'student' 
                    ? 'border-[var(--color-primary-dark)] bg-white shadow-md' 
                    : 'border-transparent bg-white/50 hover:bg-white/70'
                }`}
              >
                <GraduationCap className={role === 'student' ? 'text-[var(--color-primary-dark)]' : 'text-gray-500'} />
                <span className={`text-sm font-medium ${role === 'student' ? 'text-[var(--color-text-main)]' : 'text-gray-500'}`}>
                  Student
                </span>
              </button>
              
              <button
                type="button"
                onClick={() => setRole('instructor')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all ${
                  role === 'instructor' 
                    ? 'border-[var(--color-primary-dark)] bg-white shadow-md' 
                    : 'border-transparent bg-white/50 hover:bg-white/70'
                }`}
              >
                <BookOpen className={role === 'instructor' ? 'text-[var(--color-primary-dark)]' : 'text-gray-500'} />
                <span className={`text-sm font-medium ${role === 'instructor' ? 'text-[var(--color-text-main)]' : 'text-gray-500'}`}>
                  Instructor
                </span>
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-primary flex items-center justify-center space-x-2 mt-4"
          >
            <UserPlus className="h-5 w-5" />
            <span>Sign Up</span>
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-[var(--color-text-muted)]">Already have an account? </span>
          <Link to="/login" className="font-semibold text-[var(--color-primary-dark)] hover:underline">
            Login here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

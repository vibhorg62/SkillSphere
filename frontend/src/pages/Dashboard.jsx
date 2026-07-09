import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BookOpen, Award, Users, ArrowRight, PlayCircle, Book, CheckCircle } from 'lucide-react';

const SKILLS = [
  { name: 'React', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { name: 'Node.js', color: 'bg-green-100 text-green-800 border-green-200' },
  { name: 'Python', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { name: 'AWS', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { name: 'Docker', color: 'bg-sky-100 text-sky-800 border-sky-200' },
  { name: 'Machine Learning', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { name: 'UI/UX Design', color: 'bg-pink-100 text-pink-800 border-pink-200' },
  { name: 'C++', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { name: 'Go', color: 'bg-teal-100 text-teal-800 border-teal-200' },
  { name: 'Kubernetes', color: 'bg-blue-200 text-blue-900 border-blue-300' },
  { name: 'TypeScript', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'JavaScript', color: 'bg-yellow-200 text-yellow-900 border-yellow-300' },
  { name: 'MongoDB', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { name: 'PostgreSQL', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { name: 'GraphQL', color: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200' }
];

const SkillsMarquee = () => {
  // Duplicate skills to make the infinite scroll seamless
  const displaySkills = [...SKILLS, ...SKILLS];
  
  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden bg-white/50 py-8 mt-12 shadow-sm border-y border-yellow-100 backdrop-blur-sm">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--color-background)] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--color-background)] to-transparent z-10 pointer-events-none"></div>
      
      <div className="animate-scroll flex items-center gap-6 px-4 cursor-pointer">
        {displaySkills.map((skill, idx) => (
          <div key={idx} className={`flex items-center gap-3 font-extrabold text-xl whitespace-nowrap px-8 py-4 rounded-2xl shadow-sm border ${skill.color} hover:scale-105 transition-transform duration-300`}>
            <CheckCircle className="w-6 h-6 opacity-70" />
            {skill.name}
          </div>
        ))}
      </div>
    </div>
  );
};

const DashBoard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  console.log("DASHBOARD MOUNTED - Checking Vite HMR!");
  
  const [stats, setStats] = useState({ total: 0, inProgress: 0, completed: 0, totalStudents: 0 });
  const [recentCourse, setRecentCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      if (user.role === 'instructor') {
        const res = await axios.get('/api/courses/instructor/my-courses');
        const courses = res.data.courses;
        const totalStudents = courses.reduce((sum, c) => sum + (c.students || 0), 0);
        setStats({ total: courses.length, inProgress: 0, completed: 0, totalStudents });
        
        if (courses.length > 0) {
          setRecentCourse(courses[0]);
        }
      } else {
        const res = await axios.get('/api/enrollments/my-courses');
        const enrols = res.data.enrollments;
        
        let completedCount = enrols.filter(e => e.isCompleted).length;
        setStats({
          total: enrols.length,
          inProgress: enrols.length - completedCount,
          completed: completedCount
        });
        
        if (enrols.length > 0) {
          // Show the first course as recent
          setRecentCourse(enrols[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    // Public Landing Page view
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col">
        {/* Hero Section */}
        <div className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-100 to-transparent opacity-50 pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-[var(--color-text-main)] leading-tight">
                Unlock Your Potential with <span className="text-[var(--color-primary-dark)]">SkillSphere</span>
              </h1>
              <p className="text-xl md:text-2xl text-[var(--color-text-muted)] mb-10 max-w-2xl mx-auto">
                Join thousands of learners and instructors in the ultimate learning management system.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  <span>Start Learning for Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/courses" className="glass-card text-lg px-8 py-4 rounded-lg font-semibold hover:bg-white/40 transition-colors w-full sm:w-auto">
                  Explore Courses
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Public Skills Strip */}
        <SkillsMarquee />
      </div>
    );
  }

  // Logged-in User Dashboard view
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-main)]">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-[var(--color-text-muted)] mt-2 text-lg">
          Here is what's happening with your courses today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card p-6 rounded-2xl flex items-start space-x-4"
        >
          <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[var(--color-text-muted)] font-medium">
              {user.role === 'instructor' ? 'Published Courses' : 'Enrolled Courses'}
            </p>
            <h3 className="text-3xl font-bold mt-1 text-[var(--color-text-main)]">
              {loading ? '-' : stats.total}
            </h3>
          </div>
        </motion.div>

        {user.role === 'instructor' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-card p-6 rounded-2xl flex items-start space-x-4"
          >
            <div className="bg-green-100 p-3 rounded-xl text-green-600">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[var(--color-text-muted)] font-medium">Total Students</p>
              <h3 className="text-3xl font-bold mt-1 text-[var(--color-text-main)]">
                {loading ? '-' : stats.totalStudents}
              </h3>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-card p-6 rounded-2xl flex items-start space-x-4"
          >
            <div className="bg-green-100 p-3 rounded-xl text-green-600">
              <PlayCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[var(--color-text-muted)] font-medium">In Progress</p>
              <h3 className="text-3xl font-bold mt-1 text-[var(--color-text-main)]">
                {loading ? '-' : stats.inProgress}
              </h3>
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className={`glass-card p-6 rounded-2xl flex items-start space-x-4 ${user.role === 'instructor' ? 'opacity-50' : ''}`}
        >
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[var(--color-text-muted)] font-medium">
              {user.role === 'instructor' ? 'Avg. Rating' : 'Completed'}
            </p>
            <h3 className="text-3xl font-bold mt-1 text-[var(--color-text-main)]">
              {user.role === 'instructor' ? '4.8' : (loading ? '-' : stats.completed)}
            </h3>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions / Recent Courses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-main)]">
          {user.role === 'instructor' ? 'Manage Your Courses' : 'Continue Learning'}
        </h2>
        
        {recentCourse && !loading ? (
          <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between border border-yellow-200">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="w-24 h-24 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
                {(user.role === 'instructor' ? recentCourse.thumbnail : recentCourse.course?.thumbnail) ? (
                  <img src={user.role === 'instructor' ? recentCourse.thumbnail : recentCourse.course?.thumbnail} alt="Course" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-yellow-100 text-yellow-500"><Book className="w-8 h-8" /></div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--color-text-main)]">
                  {user.role === 'instructor' ? recentCourse.title : recentCourse.course?.title}
                </h3>
                <p className="text-[var(--color-text-muted)]">
                  {user.role === 'instructor' 
                    ? `${recentCourse.students || 0} Students Enrolled` 
                    : `${recentCourse.progressPercentage || 0}% Completed`}
                </p>
              </div>
            </div>
            <Link 
              to={user.role === 'instructor' ? `/courses/${recentCourse._id}/manage` : `/courses/${recentCourse.course?._id}/learn`}
              className="btn-primary px-6 py-3 w-full md:w-auto flex justify-center items-center gap-2"
            >
              <span>{user.role === 'instructor' ? 'Manage Course' : (recentCourse.isCompleted ? 'Review Content' : 'Continue Course')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="glass-card p-8 rounded-2xl text-center border-dashed border-2 border-yellow-300">
            <Users className="w-16 h-16 text-yellow-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">
              {user.role === 'instructor' ? "You haven't created any courses yet" : "You haven't started any new courses recently"}
            </h3>
            <p className="text-[var(--color-text-muted)] mb-6">
              {user.role === 'instructor' ? "Share your knowledge with the world." : "Explore our catalog and find something new to learn!"}
            </p>
            <Link to={user.role === 'instructor' ? "/courses/create" : "/courses"} className="btn-primary px-6 py-3 inline-block w-auto">
              {user.role === 'instructor' ? "Create a Course" : "Browse Catalog"}
            </Link>
          </div>
        )}
      </motion.div>

      {/* Logged-in Skills Strip (Moved outside max-w-7xl so it spans full width if desired, or kept inside for bounded view) */}
      <div className="mt-16 -mx-4 sm:-mx-6 lg:-mx-8">
        <h2 className="text-center text-xl font-bold text-gray-500 mb-2">Trending Topics to Master</h2>
        <SkillsMarquee />
      </div>
    </div>
  );
};

export default DashBoard;
